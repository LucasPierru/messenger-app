import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:4000";

export const getSocket = (token: string) => {
  const socket = io(URL, {
    auth: {
      token,
    },
    autoConnect: false,
  });
  return socket;
};
