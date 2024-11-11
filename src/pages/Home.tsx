import { useEffect } from "react";
import { socket } from "../socket";
import Conversations from "../components/conversations/conversation";

export default function Home() {
  function onConnect() {
    console.log("user connected");
  }

  function onJoinRoom() {
    console.log("joined room");
  }

  useEffect(() => {
    socket.connect();
    socket.on("connect", onConnect);

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinRoom = () => {
    socket.emit("joinRoom", "room1", (response) => {
      console.log(response);
    });
  };

  return (
    <main>
      {/* <button
        className="bg-primary py-2 px-4 rounded-xl text-lg"
        type="button"
        onClick={joinRoom}
      >
        Join Room
      </button> */}
    </main>
  );
}
