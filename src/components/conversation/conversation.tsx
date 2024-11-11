import { Link, useParams } from "react-router-dom";

type ConversationProps = {
  id: string;
  imageUrl: string;
  title: string;
  lastMessage: string;
};

const Conversation = ({
  id,
  imageUrl,
  title,
  lastMessage
}: ConversationProps) => {
  const { id: conversationId } = useParams();

  return (
    <Link
      className={`flex items-center p-2 mx-2 gap-2 rounded-xl lg:min-w-80 ${id === conversationId ? "bg-[#25313f]" : ""}`}
      to={`/${id}`}
    >
      <img
        className="rounded-full"
        src={imageUrl}
        alt="conversation"
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <span className="text-base font-semibold">{title}</span>
        <span className="text-sm">{lastMessage}</span>
      </div>
    </Link>
  );
};

export default Conversation;
