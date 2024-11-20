import { AxiosError, AxiosResponse } from "axios";
import { IConversation } from "../../types/conversation";
import api, { createApiError } from "../api";

export const fetchConversations = async (): Promise<{
  conversations: IConversation[];
}> => {
  try {
    const response: AxiosResponse<{ conversations: IConversation[] }> = await api.get("/v1/conversation");
    return response.data;
  } catch (error) {
    throw createApiError(error as AxiosError);
  }
};

export const fetchMessages = async ({ conversationId }: { conversationId: string }) => {
  try {
    const response = await api.get(`/v1/conversation/messages/${conversationId}`);
    return { ...response.data, error: null };
  } catch (error) {
    return { messages: null, error };
  }
};
