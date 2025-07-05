import { IMessage } from "@/types/message";
import { IUser } from "@/types/user";

type MessageProps = {
  message: IMessage;
  userId: string;
};

const Message = ({ message, userId }: MessageProps) => {
  return (
    <div
      className={`flex flex-col gap-1 w-fit max-w-[50%] ${(message?.user as IUser)?._id === userId ? "self-end items-end" : "self-start"}`}
      key={message._id}>
      <span
        className={`h-fit px-4 py-2 rounded-2xl break-words text-foreground text-sm lg:text-base font-medium ${(message?.user as IUser)?._id === userId ? "bg-[#0184fe]" : "bg-border"}`}>
        {message.content}
      </span>
      <span className="text-xs text-muted-foreground mb-1 px-2">
        {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
};

export default Message;
