import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useChatStore } from "@/store/useChatStore";
import { IMessage } from "@/types/message";

type ConversationProps = {
  id: string;
  imageUrl?: string;
  title?: string;
  lastMessage: IMessage;
};

const Conversation = ({ id, imageUrl, title, lastMessage }: ConversationProps) => {
  const { id: conversationId } = useParams();

  const isConversationUnread = () => {
    const lastRead = useChatStore.getState().conversations.find((c) => c._id === id)?.lastReadAt;
    const lastMsg = lastMessage;
    // console.log({ lastMsg, lastRead });
    return lastMsg && (!lastRead || new Date(lastMsg.createdAt) > new Date(lastRead));
  };

  const isUnread = isConversationUnread();

  return (
    <Link
      className={`flex items-center p-2 gap-2 min-w-xs w-full ${id === conversationId ? "bg-primary-foreground" : ""}`}
      to={`/conversation/${id}`}>
      <Avatar>
        <AvatarImage src={imageUrl} />
        <AvatarFallback>NC</AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <span className="text-base font-semibold">{title}</span>
        <div className="flex items-center gap-2">
          {isUnread && <span className="bg-blue-500 rounded-full w-1 h-1" />}
          <span className={`text-sm line-clamp-1 ${isUnread ? "font-bold" : "font-normal"}`}>
            {lastMessage.content}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Conversation;
