import { AxiosError, AxiosResponse } from "axios";
import { IConversation, IConversationWithUsers } from "../../types/conversation";
import api, { createApiError } from "../api";
import { IMessage } from "@/types/message";

export const fetchConversations = async (): Promise<{
  conversations: IConversationWithUsers[];
}> => {
  try {
    const response: AxiosResponse<{ conversations: IConversationWithUsers[] }> = await api.get("/v1/conversation");
    return response.data;
  } catch (error) {
    throw createApiError(error as AxiosError);
  }
};

export const createConversation = async (userIds: string[]): Promise<{
  conversation: IConversation;
  users: string[]
}> => {
  try {
    const response: AxiosResponse<{ conversation: IConversation, users: string[] }> = await api.post("/v1/conversation/create", { users: userIds });
    return response.data;
  } catch (error) {
    throw createApiError(error as AxiosError);
  }
};

export const fetchMessages = async ({ conversationId }: { conversationId: string }): Promise<{
  messages: IMessage[] | null;
  hasMore: boolean;
  error: unknown | null;
}> => {
  try {
    const response = await api.get(`/v1/conversation/messages/${conversationId}`);
    return { ...response.data, error: null };
  } catch (error) {
    return { messages: null, hasMore: false, error };
  }
};

export const sendMessage = async ({ conversationId, content }: { conversationId: string; content: string }): Promise<{
  message: IMessage | null;
  error: unknown | null;
}> => {
  try {
    const response: AxiosResponse<{ message: IMessage }> = await api.post(`/v1/conversation/message/create`, { conversationId, content });
    return { ...response.data, error: null };
  } catch (error) {
    return { message: null, error };
  }
};

export const readConversation = async ({ conversationId, readAt }: { conversationId: string, readAt: Date }): Promise<{
  conversationUser: unknown | null;
  error: unknown | null;
}> => {
  try {
    const response = await api.post(`/v1/conversation/read/${conversationId}`, { readAt });
    return { ...response.data, error: null };
  } catch (error) {
    return { conversationUser: null, error };
  }
};
