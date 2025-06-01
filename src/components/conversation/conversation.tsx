import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type ConversationProps = {
  id: string;
  imageUrl: string;
  title: string;
  lastMessage: string;
};

const Conversation = ({ id, imageUrl, title, lastMessage }: ConversationProps) => {
  const { id: conversationId } = useParams();

  return (
    <Link
      className={`flex items-center p-2 gap-2 lg:min-w-80 ${id === conversationId ? "bg-primary-foreground" : ""}`}
      to={`/conversation/${id}`}>
      <Avatar>
        <AvatarImage src={imageUrl} />
        <AvatarFallback>NC</AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <span className="text-base font-semibold">{title}</span>
        <span className="text-sm">{lastMessage}</span>
      </div>
    </Link>
  );
};

export default Conversation;
