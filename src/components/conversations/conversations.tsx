import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { Link, useParams } from "react-router-dom";
import { fetchProfile } from "@/api/profile/profile";
import Conversation from "../conversation/conversation";
import ProfileButton from "../profile-button/profile-button";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useChatStore } from "@/store/useChatStore";

const Conversations = () => {
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
  const conversations = useChatStore((state) => state.conversations);
  const getConversations = useChatStore((state) => state.getConversations);

  const isMobile = useIsMobile();
  const { id } = useParams();

  useEffect(() => {
    getConversations();
  }, []);

  return (
    <div
      className={`${isMobile && !id ? "block" : "hidden"} md:block border-r border-r-border min-h-full w-full md:max-w-xs`}>
      <div className="p-4 border-b border-b-border">
        {profileQuery.data && profileQuery.data.profile && (
          <ProfileButton
            firstName={profileQuery.data.profile.firstName}
            lastName={profileQuery.data.profile.lastName}
          />
        )}
      </div>
      <div className="flex flex-col">
        {conversations &&
          conversations.length > 0 &&
          conversations.map((conversation) => {
            return (
              <Conversation
                key={conversation._id}
                id={conversation._id}
                imageUrl={conversation.pictureUrl}
                title={conversation.name}
                lastMessage={conversation.lastMessage!}
                isGroup={conversation.isGroup}
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
