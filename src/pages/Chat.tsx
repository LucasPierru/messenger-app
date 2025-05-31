import { useParams } from "react-router-dom";
import { useEffect, useRef, useState, KeyboardEvent, Key, ChangeEvent } from "react";
import { getSocket } from "../socket";
import { Conversation, getConversation, Message } from "../lib/data/conversations";
import { Input } from "@/components/ui/input";
import { fetchProfiles } from "@/api/profile/profile";

export interface IAboutProps {}

export default function Chat(props: IAboutProps) {
  const { id } = useParams();
  const [conversation, setConversation] = useState<Conversation>({} as Conversation);
  const messageRef = useRef<HTMLInputElement>(null);
  const socket = getSocket(localStorage.getItem("token") || "");

  useEffect(() => {
    socket.connect();
    if (id) {
      joinRoom();
      setConversation(getConversation(id));
    }
    listenToMessages();

    return () => leaveRoom();
  }, [id]);

  const listenToMessages = () => {
    socket.on("message", ({ message }) => {
      setConversation((currentConversation) => {
        const newMessages = [...currentConversation!.messages];
        newMessages.push(message);
        return {
          ...currentConversation,
          messages: newMessages,
        };
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

  const sendMessage = (event: KeyboardEvent<HTMLInputElement>) => {
    if (messageRef.current && messageRef.current.value && event.key === "Enter") {
      const newMessage: Message = {
        id: "",
        conversationId: id!,
        senderId: "1",
        content: messageRef.current.value,
        timeStamp: new Date(),
      };

      socket.emit("message", id, newMessage);
      messageRef.current.value = "";
    }
  };

  return (
    <main className="flex flex-col justify-between w-full">
      {id && id !== "new" && (
        <>
          <div className="flex items-center gap-2 p-4 shadow-xl">
            <img
              className="rounded-full"
              src={conversation?.imageUrl}
              alt={conversation?.title}
              height={40}
              width={40}
            />
            <h1 className="font-semibold">{conversation?.title}</h1>
          </div>
          <div className="flex flex-col gap-2 grow p-4">
            {conversation?.messages?.map((message, index) => {
              return (
                <span
                  className={`w-fit max-w-[33%] px-4 py-1 rounded-2xl break-words ${message.senderId === "1" ? "bg-[#0184fe] self-end" : "bg-[#303131]"}`}
                  key={index as Key}>
                  {message.content}
                </span>
              );
            })}
          </div>
        </>
      )}
      <div className="flex items-center gap-2 p-4 border-b border-b-border">
        <span className="min-w-fit">New message to:</span>
        <input
          className="focus:outline-none w-full"
          onChange={async (event: ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            if (value && value.length > 2) {
              const { profiles } = await fetchProfiles(value);
              console.log({ profiles });
            }
          }}
        />
      </div>
      <div className="p-4">
        <Input className="rounded-full py-2 px-4 w-full" placeholder="Aa" ref={messageRef} onKeyDown={sendMessage} />
      </div>
    </main>
  );
}
