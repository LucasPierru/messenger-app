import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";

export const useChatSocket = () => {
  const subscribeToMessages = useChatStore((s) => s.subscribeToMessages);
  const unsubscribeFromMessages = useChatStore((s) => s.unsubscribeFromMessages);

  useEffect(() => {
    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, []);
};
