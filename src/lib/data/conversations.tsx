export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timeStamp: Date;
};

export type Conversation = {
  id: string;
  imageUrl: string;
  title: string;
  lastMessage: string;
  messages: Message[];
};

export const conversations: Conversation[] = [
  {
    id: "room-1",
    imageUrl: "/Punk.jpg",
    title: "group chat",
    lastMessage: "John: Hello! how are you",
    messages: [
      {
        id: "1",
        conversationId: "room-1",
        senderId: "1",
        content: "Hello !",
        timeStamp: new Date()
      },
      {
        id: "2",
        conversationId: "room-1",
        senderId: "2",
        content: "How are you?",
        timeStamp: new Date()
      }
    ]
  },
  {
    id: "room-2",
    imageUrl: "/Punk.jpg",
    title: "group chat",
    lastMessage: "John: Hello! how are you",
    messages: []
  }
];

export const getConversation = (id: string) => {
  const conversation = conversations.find((conv) => conv.id === id);
  return conversation!!;
};
