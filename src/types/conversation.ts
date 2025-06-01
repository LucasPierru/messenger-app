import { IMessage } from "./message";

export type IConversation = {
  _id: string;
  name: string;
  imageUrl: string;
  createdAt: Date;
  lastActive: Date;
};

export type IConversationWithUsers = {
  conversation: IConversation;
  lastMessage: IMessage | null;
};
