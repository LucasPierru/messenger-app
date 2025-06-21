import { create } from 'zustand';
import { IMessage } from '@/types/message';
import { fetchMessages, sendMessage } from '@/api/conversations/conversations';
import { useAuthStore } from './useAuthStore';

interface Conversation {
  _id: string;
  name?: string;
  isGroup: boolean;
  pictureUrl?: string;
  lastMessage: IMessage | null;
  lastReadAt: Date | null;
  lastActive: Date;
}

type ChatState = {
  conversations: Conversation[];
  messages: IMessage[];
  activeConversationId: string | null;

  // Actions
  setConversations: (convos: Conversation[]) => void;
  setActiveConversation: (id: string) => void;
  /* receiveMessage: (message: IMessage) => void; */
  getMessages: (conversationId: string) => Promise<void>;
  sendMessage: (messageData: { content: string }) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  updateConversationLastMessage: (conversationId: string, message: IMessage) => void;
  updateConversationReadAt: (conversationId: string, readAt: Date) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  messages: [],
  activeConversationId: null,

  setConversations: (convos) => {
    set({ conversations: convos.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()) });
  },

  setActiveConversation: (id) => {
    set({ activeConversationId: id });
  },

  getMessages: async (conversationId: string) => {
    try {
      const { messages } = await fetchMessages({ conversationId })
      set({
        messages: messages ?? [],
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  },

  sendMessage: async (messageData: { content: string }) => {
    const { activeConversationId, messages } = get();
    try {
      const { message } = await sendMessage({ conversationId: activeConversationId!, content: messageData.content });
      set({ messages: [message!, ...messages] });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },

  subscribeToMessages: () => {
    const { activeConversationId } = get();
    if (!activeConversationId) return;

    const { socket, authUser } = useAuthStore.getState();

    socket?.on("newMessage", (newMessage) => {
      const isMessageSentFromCurrentUser = newMessage.user._id === authUser?._id;
      if (isMessageSentFromCurrentUser) return;

      set({
        messages: [newMessage, ...get().messages],
      });
    });

  },

  unsubscribeFromMessages: () => {
    const { socket } = useAuthStore.getState();
    socket?.off("newMessage");
  },

  /* receiveMessage: (message) => {
    const convoId = isPopulatedConversation(message.conversation) ? message.conversation._id : message.conversation;
    const state = get();

    // 1. Add message if active
    if (state.activeConversationId === convoId) {
      get().addMessage(message);
    }

    // 2. Update conversations list
    const updated = state.conversations.map((c) =>
      c._id === convoId
        ? {
          ...c,
          lastMessage: message,
          lastActive: message.createdAt,
        }
        : c
    );

    const sorted = updated.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());

    set({ conversations: sorted });
  }, */

  updateConversationLastMessage: (conversationId, message) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c._id === conversationId
          ? { ...c, lastMessage: message }
          : c
      ),
    }));
  },

  updateConversationReadAt: (conversationId: string, readAt: Date) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c._id === conversationId ? { ...c, lastReadAt: readAt } : c
      ),
    }));
  },
}));