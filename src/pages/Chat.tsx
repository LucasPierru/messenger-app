import { useParams } from "react-router-dom";
import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { getSocket } from "../socket";
import {
  Conversation,
  getConversation,
  Message
} from "../lib/data/conversations";

export interface IAboutProps {}

export default function Chat(props: IAboutProps) {
  const { id } = useParams();
  const [conversation, setConversation] = useState<Conversation>(
    {} as Conversation
  );
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
          messages: newMessages
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
    if (
      messageRef.current &&
      messageRef.current.value &&
      event.key === "Enter"
    ) {
      const newMessage: Message = {
        id: "",
        conversationId: id!,
        senderId: "1",
        content: messageRef.current.value,
        timeStamp: new Date()
      };

      socket.emit("message", id, newMessage);
      messageRef.current.value = "";
    }
  };

  return (
    <main className="flex flex-col w-full">
      {id && (
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
                  key={index}
                >
                  {message.content}
                </span>
              );
            })}
          </div>
          <div className="p-4">
            <input
              className="bg-[#323234] rounded-full py-2 px-4 w-full"
              placeholder="Aa"
              ref={messageRef}
              onKeyDown={sendMessage}
            />
          </div>
        </>
      )}
    </main>
  );
}
