/* eslint-disable no-underscore-dangle */
import { useQuery } from "@tanstack/react-query";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { Link, useParams } from "react-router-dom";
import { fetchConversations } from "@/api/conversations/conversations";
import { fetchProfile } from "@/api/profile/profile";
import Conversation from "../conversation/conversation";
import ProfileButton from "../profile-button/profile-button";
import { useIsMobile } from "@/hooks/useIsMobile";

const Conversations = () => {
  const query = useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
  });

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const isMobile = useIsMobile();
  const { id } = useParams();

  return (
    <div
      className={`${isMobile && !id ? "block" : "hidden"} md:block border-r border-r-border min-h-full w-full md:max-w-xs`}>
      <div className="p-4">
        {profileQuery.data && profileQuery.data.profile && (
          <ProfileButton
            firstName={profileQuery.data.profile.firstName}
            lastName={profileQuery.data.profile.lastName}
          />
        )}
      </div>
      <div className="flex flex-col">
        {query.data &&
          query.data.conversations &&
          query.data?.conversations.length > 0 &&
          query.data.conversations.map(({ conversation, lastMessage }) => {
            return (
              <Conversation
                key={conversation._id}
                id={conversation._id}
                imageUrl={conversation.imageUrl}
                title={conversation.name}
                lastMessage={lastMessage?.content || ""}
              />
            );
          })}
      </div>
      <div className="p-4">
        <Link to="/conversation/new" className="flex flex-col items-center mx-auto">
          <PencilSquareIcon className="w-8 h-8" />
          <span className="">Create a conversation</span>
        </Link>
      </div>
    </div>
  );
};

export default Conversations;
