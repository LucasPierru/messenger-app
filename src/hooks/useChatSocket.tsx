import { useEffect, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import { getSocket } from "@/socket";

export const useChatSocket = () => {
  const receiveMessage = useChatStore((s) => s.receiveMessage);
  const updateConversationLastMessage = useChatStore((s) => s.updateConversationLastMessage);
  const socket = useMemo(() => getSocket(localStorage.getItem("token") || ""), []);
  const activeConversationId = useChatStore((s) => s.activeConversationId);

  const joinRoom = (id: string) => {
    socket.emit("joinRoom", id);
  };

  const leaveRoom = (id: string) => {
    socket.emit("leaveRoom", id);
    socket.off("message");
    socket.disconnect();
  };

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("message", (message) => {
      receiveMessage(message);
      updateConversationLastMessage(message.conversation, message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !activeConversationId) return undefined;

    // Join new room
    joinRoom(activeConversationId);

    return () => {
      leaveRoom(activeConversationId);
    };
  }, [activeConversationId]);
};
