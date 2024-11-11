import Conversation from "../conversation/conversation";

const Conversations = () => {
  const conversations = [
    {
      id: "room-1",
      imageUrl: "/Punk.jpg",
      title: "group chat",
      lastMessage: "John: Hello! how are you"
    },
    {
      id: "room-2",
      imageUrl: "/Punk.jpg",
      title: "group chat",
      lastMessage: "John: Hello! how are you"
    }
  ];

  return (
    <div className="border-r border-r-[rgba(255,255,255,0.5)] min-h-full">
      <h1 className="text-lg font-bold mx-2 mb-4">Chats</h1>
      {conversations.map((conversation) => {
        return (
          <Conversation
            key={conversation.id}
            id={conversation.id}
            imageUrl={conversation.imageUrl}
            title={conversation.title}
            lastMessage={conversation.lastMessage}
          />
        );
      })}
    </div>
  );
};

export default Conversations;
