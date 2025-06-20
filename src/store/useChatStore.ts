import { create } from 'zustand';
import { IMessage } from '@/types/message';
import { isPopulatedConversation } from '@/lib/utils';

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
  messages: Record<string, IMessage[]>;
  activeConversationId: string | null;

  // Actions
  setConversations: (convos: Conversation[]) => void;
  setActiveConversation: (id: string) => void;
  addMessage: (message: IMessage) => void;
  receiveMessage: (message: IMessage) => void;
  setMessages: (conversationId: string, messages: IMessage[]) => void;
  updateConversationLastMessage: (conversationId: string, message: IMessage) => void;
  updateConversationReadAt: (conversationId: string, readAt: Date) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  messages: {},
  activeConversationId: null,

  setConversations: (convos) => {
    set({ conversations: convos.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()) });
  },

  setActiveConversation: (id) => {
    set({ activeConversationId: id });
  },

  addMessage: (message) => {
    const { messages } = get();
    const convoId = isPopulatedConversation(message.conversation) ? message.conversation._id : message.conversation;

    const convoMessages = messages[convoId] || [];
    set({
      messages: {
        ...messages,
        [convoId]: [...convoMessages, message],
      },
    });
  },

  setMessages: (conversationId: string, messages: IMessage[]) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: messages,
      },
    }));
  },

  receiveMessage: (message) => {
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
  },

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