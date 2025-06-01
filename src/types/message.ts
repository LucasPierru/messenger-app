import { IConversation } from "./conversation";
import { IUser } from "./user";

export type IMessage = {
  _id: string;
  conversation: IConversation | string;
  user: IUser | string;
  createdAt: Date;
  content: string;
  media_url?: string,
};