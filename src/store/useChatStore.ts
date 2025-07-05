import { create } from 'zustand';
import { IMessage } from '@/types/message';
import { fetchConversations, fetchMessages, readConversation, sendMessage } from '@/api/conversations/conversations';
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
  getMessages: (conversationId: string, limit?: number, page?: number) => Promise<void>;
  sendMessage: (messageData: { content: string }) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  getConversations: () => Promise<void>;
  updateConversationLastMessage: (conversationId: string, message: IMessage) => void;
  updateConversationReadAt: (conversationId: string, readAt: Date) => Promise<void>;
  isConversationsLoading: boolean;
  isMessagesLoading: boolean;
  hasMoreMessages: boolean;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  messages: [],
  activeConversationId: null,
  isConversationsLoading: false,
  isMessagesLoading: false,
  hasMoreMessages: true,

  setConversations: (convos) => {
    set({ conversations: convos.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()) });
  },

  setActiveConversation: (id) => {
    set({ activeConversationId: id });
  },

  getMessages: async (conversationId: string, limit?: number, page?: number) => {
    const { messages } = get();
    set({ isMessagesLoading: !limit || !page });
    try {
      const { messages: olderMessages } = await fetchMessages({ conversationId, ...(limit && { limit }), ...(page && { page }) });
      if (!olderMessages) {
        set({ hasMoreMessages: false });
        return;
      }
      set({
        messages: limit && page ? [...olderMessages, ...messages] : olderMessages ?? [],
      });
      set({ hasMoreMessages: olderMessages.length === (limit ?? 20) });
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      set({ isMessagesLoading: false });
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
    const { socket, authUser } = useAuthStore.getState();

    if (!socket) return;

    socket?.on("newMessage", (newMessage) => {
      const isMessageSentFromCurrentUser = newMessage.user._id === authUser?.id;
      if (isMessageSentFromCurrentUser) return;

      if (activeConversationId) {
        set({
          messages: [newMessage, ...get().messages],
        });
        get().updateConversationReadAt(activeConversationId, new Date());
      }
      get().updateConversationLastMessage(newMessage.conversation._id, newMessage);
    });

  },

  unsubscribeFromMessages: () => {
    const { socket } = useAuthStore.getState();
    socket?.off("newMessage");
  },

  getConversations: async () => {
    set({ isConversationsLoading: true });
    try {
      const { conversations } = await fetchConversations();
      const newConversations = conversations.map((c) => ({
        _id: c.conversation._id,
        name: c.conversation.name,
        pictureUrl: c.conversation.pictureUrl,
        isGroup: c.conversation.isGroup,
        lastActive: c.conversation.lastActive || new Date().toISOString(),
        lastReadAt: c.lastReadAt || null,
        lastMessage: c.lastMessage,
      }));
      set({ conversations: newConversations });
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      set({ isConversationsLoading: false });
    }
  },

  updateConversationLastMessage: (conversationId, message) => {
    const { activeConversationId } = get();

    set((state) => ({
      conversations: state.conversations.map((c) =>
        c._id === conversationId
          ? { ...c, lastReadAt: activeConversationId === c._id ? new Date() : c.lastReadAt, lastMessage: message }
          : c
      ),
    }));
  },

  updateConversationReadAt: async (conversationId: string, readAt: Date) => {
    await readConversation({
      conversationId,
      readAt,
    });
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c._id === conversationId ? { ...c, lastReadAt: readAt } : c
      ),
    }));
  },
}));