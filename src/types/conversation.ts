import { IMessage } from "./message";
import { IUser } from "./user";

export type IConversation = {
  _id: string;
  name: string;
  pictureUrl: string;
  isGroup: boolean;
  createdBy: IUser | string;
  createdAt: Date;
  lastActive: Date;
};

export type IConversationWithUsers = {
  conversation: IConversation;
  lastMessage: IMessage | null;
};
