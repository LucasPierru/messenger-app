import { IConversation } from "./conversation";
import { IUser } from "./user";

export type IMessage = {
  _id: string;
  conversation: IConversation | string;
  user: IUser | string;
  isEdited?: boolean;
  createdAt: Date;
  content: string;
  media_url?: string;
  seenBy?: IUser[] | string[];
};