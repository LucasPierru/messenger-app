import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, KeyboardEvent, Key, ChangeEvent, useMemo } from "react";
import { SendHorizontalIcon } from "lucide-react";
import { getSocket } from "../socket";
import { Input } from "@/components/ui/input";
import { fetchProfile, fetchProfiles } from "@/api/profile/profile";
import { IUser } from "@/types/user";
import { Button } from "@/components/ui/button";
import { createConversation, fetchMessages } from "@/api/conversations/conversations";
import { IMessage } from "@/types/message";

export interface IAboutProps {}

export default function Chat(props: IAboutProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<IMessage[]>([]);
  const [searchedProfiles, setSearchedProfiles] = useState<IUser[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<IUser[]>([]);
  const messageRef = useRef<HTMLInputElement>(null);
  const userRef = useRef<HTMLInputElement>(null);
  const socket = useMemo(() => getSocket(localStorage.getItem("token") || ""), []);

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const getMessages = async () => {
    if (id) {
      const { messages } = await fetchMessages({ conversationId: id });
      if (messages) {
        setConversation(messages);
      }
    }
  };

  useEffect(() => {
    socket.connect();
    if (id) {
      joinRoom();
    }
    getMessages();
    listenToMessages();
    return () => leaveRoom();
  }, [id]);

  const listenToMessages = () => {
    socket.on("message", ({ message }) => {
      setConversation((currentConversation) => {
        /* console.log("Current conversation before update:", currentConversation); */
        const newMessages = [...currentConversation];
        newMessages.unshift(message);
        return newMessages;
      });
    });
  };

  const joinRoom = () => {
    socket.emit("joinRoom", id);
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom", id);
    socket.off("message");
    socket.disconnect();
  };

  const sendMessage = () => {
    if (messageRef.current && messageRef.current.value) {
      const newMessage: Omit<IMessage, "_id"> = {
        conversation: id!,
        user: profileQuery.data?.profile?._id || "",
        content: messageRef.current.value,
        createdAt: new Date(),
      };

      socket.emit("message", id, newMessage);
      messageRef.current.value = "";
    }
  };

  const enterMessage = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
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

  return (
    <main className="flex flex-col justify-between w-full">
      {id && id !== "new" && (
        <>
          <div className="flex items-center gap-2 p-4 border-b border-b-border">
            <img
              className="rounded-full"
              src={conversation?.imageUrl}
              alt={conversation?.title}
              height={40}
              width={40}
            />
            <h1 className="font-semibold">{conversation?.title}</h1>
          </div>
          <div className="flex flex-col-reverse gap-2 grow p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            {conversation?.map((message, index) => {
              return (
                <span
                  className={`w-fit max-w-[50%] px-4 py-2 rounded-2xl break-words text-sm lg:text-base font-medium ${(message.user as IUser)._id === profileQuery.data?.profile?._id ? "bg-[#0184fe] text-background self-end" : "bg-border"}`}
                  key={index as Key}>
                  {message.content}
                </span>
              );
            })}
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
        <Button className="rounded-full" size="icon" onClick={sendMessage}>
          <SendHorizontalIcon />
        </Button>
      </div>
    </main>
  );
}
