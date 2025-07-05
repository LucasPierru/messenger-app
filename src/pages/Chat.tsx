import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, KeyboardEvent, ChangeEvent } from "react";
import { SendHorizontalIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetchProfile, fetchProfiles } from "@/api/profile/profile";
import { IUser } from "@/types/user";
import { Button } from "@/components/ui/button";
import { createConversation } from "@/api/conversations/conversations";
import { IMessage } from "@/types/message";
import GoBackButton from "@/components/go-back-button/go-back-button";
import { useChatStore } from "@/store/useChatStore";
import Message from "@/components/message/message";

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [searchedProfiles, setSearchedProfiles] = useState<IUser[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<IUser[]>([]);
  const [page, setPage] = useState(2);

  const messageRef = useRef<HTMLInputElement>(null);
  const userRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const setActiveConversation = useChatStore((s) => s.setActiveConversation);
  const updateConversationReadAt = useChatStore((s) => s.updateConversationReadAt);
  const getMessages = useChatStore((s) => s.getMessages);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const isMessagesLoading = useChatStore((s) => s.isMessagesLoading);
  const hasMoreMessages = useChatStore((s) => s.hasMoreMessages);

  const msgs = useChatStore((s) => (id ? s.messages : []));

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const fetchMessages = async () => {
    if (id) {
      await getMessages(id);
    }
  };

  const readConversation = async () => {
    if (!id) return;
    const now = new Date();
    await updateConversationReadAt(id, now);
  };

  const submitMessage = async () => {
    if (messageRef.current && messageRef.current.value) {
      const newMessage: Omit<IMessage, "_id" | "user" | "createdAt"> = {
        conversation: id!,
        content: messageRef.current.value,
      };
      await sendMessage(newMessage);
      messageRef.current.value = "";
    }
  };

  const enterMessage = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      await submitMessage();
    }
  };

  const createNewConversation = async () => {
    try {
      const { conversation: newConversation } = await createConversation(
        selectedProfiles.map((profile) => profile._id)
      );
      navigate(`/conversation/${newConversation._id}`);
      window.location.reload();
    } catch (error) {
      console.error("Error creating new conversation:", error);
    }
  };

  const handleScroll = async () => {
    const container = containerRef.current;
    if (!container || isMessagesLoading || !hasMoreMessages) return;

    if (id && container.scrollTop === 0 && hasMoreMessages) {
      if (!container) return;

      const prevScrollHeight = container.scrollHeight;
      const prevScrollTop = container.scrollTop;
      await getMessages(id, 20, page);
      setPage((prevPage) => prevPage + 1);
      requestAnimationFrame(() => {
        const newScrollHeight = container.scrollHeight;
        const heightDiff = newScrollHeight - prevScrollHeight;

        // ✅ This keeps the scroll position visually the same
        container.scrollTop = prevScrollTop + heightDiff;
      });
    }
  };

  useEffect(() => {
    setActiveConversation(id || "new");
    readConversation();
    fetchMessages();
  }, [id]);

  useEffect(() => {
    if (scrollRef.current && msgs.length <= 20) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [msgs]);

  return (
    <main className="flex flex-col justify-between w-full max-h-screen">
      {id && id !== "new" && (
        <>
          <div className="flex items-center gap-2 p-4 border-b border-b-border">
            <GoBackButton />
            <img className="rounded-full" src="/Punk.jpg" alt="Name" height={40} width={40} />
            <h1 className="font-semibold">Name</h1>
          </div>
          <div
            className="flex flex-col gap-2 grow p-4 overflow-y-auto h-full"
            ref={containerRef}
            onScroll={handleScroll}>
            {msgs?.map((message) => {
              return <Message message={message} userId={profileQuery.data?.profile?._id!} key={message._id} />;
            })}
            <div ref={scrollRef} />
          </div>
        </>
      )}
      {id === "new" && (
        <div>
          <div className="flex items-center gap-2 p-4 border-b border-b-border">
            <span className="min-w-fit">New message to:</span>
            <div className="min-w-fit flex flex-wrap gap-2">
              {selectedProfiles.map((profile) => (
                <span key={profile._id} className="bg-[#0184fe] text-white px-2 py-1 rounded-full cursor-pointer">
                  {profile.firstName} {profile.lastName}
                </span>
              ))}
            </div>
            <input
              className="focus:outline-none w-full"
              ref={userRef}
              onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                const { value } = event.target;
                if (value && value.length > 2) {
                  const { profiles } = await fetchProfiles(value);
                  if (!profiles || profiles.length === 0) {
                    setSearchedProfiles([]);
                    return;
                  }
                  setSearchedProfiles(profiles);
                } else {
                  setSearchedProfiles([]);
                }
              }}
              onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                if (event.key === "Backspace" && userRef.current!.value === "") {
                  setSelectedProfiles((currentProfiles) => {
                    const newProfiles = [...currentProfiles];
                    newProfiles.pop();
                    return newProfiles;
                  });
                }
              }}
            />
            <Button onClick={createNewConversation}>Create</Button>
          </div>
          {searchedProfiles.length > 0 && (
            <div className="flex flex-col gap-0 p-2 border-b border-b-border w-full max-h-60 overflow-y-auto">
              {searchedProfiles.map((profile) => (
                <button
                  // eslint-disable-next-line no-underscore-dangle
                  key={profile._id}
                  type="button"
                  className="cursor-pointer hover:bg-[#f4f5f4] px-2 py-2 rounded-lg text-left"
                  onClick={() => {
                    setSelectedProfiles((currentProfiles) => {
                      return [...currentProfiles, profile];
                    });
                    userRef.current!.value = "";
                    userRef.current!.focus();
                    setSearchedProfiles([]);
                  }}>
                  {profile.firstName} {profile.lastName}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="flex gap-2 p-4">
        <Input className="rounded-full py-2 px-4 w-full" placeholder="Aa" ref={messageRef} onKeyDown={enterMessage} />
        <Button className="rounded-full" size="icon" onClick={submitMessage}>
          <SendHorizontalIcon />
        </Button>
      </div>
    </main>
  );
}
