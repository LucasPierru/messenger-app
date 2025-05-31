/* eslint-disable no-underscore-dangle */
import { useQuery } from "@tanstack/react-query";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { fetchConversations } from "../../api/conversations/conversations";
import Conversation from "../conversation/conversation";

const Conversations = () => {
  const query = useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
  });

  /* const conversations = [
    {
      id: "room-1",
      imageUrl: "/Punk.jpg",
      title: "group chat",
      lastMessage: "John: Hello! how are you"
    },
    {
      id: "room-2",
      imageUrl: "/Punk.jpg",
      title: "group chat",
      lastMessage: "John: Hello! how are you"
    }
  ]; */

  return (
    <div className="border-r border-r-border min-h-full">
      <h1 className="text-lg font-semibold px-2 py-4 border-b border-b-border">Chats</h1>

      {query.data &&
        query.data.conversations &&
        query.data?.conversations.length > 0 &&
        query.data.conversations.map((conversation) => {
          return (
            <Conversation
              key={conversation._id}
              id={conversation._id}
              imageUrl={conversation.imageUrl}
              title={conversation.name}
              lastMessage={conversation.lastMessage}
            />
          );
        })}
      <div className="lg:min-w-80 p-4 mx-2">
        <Link to="/conversation/new" className="flex flex-col items-center mx-auto">
          <PencilSquareIcon className="w-8 h-8" />
          Create a conversation
        </Link>
      </div>
    </div>
  );
};

export default Conversations;
