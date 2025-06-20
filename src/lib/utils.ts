import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { IConversation } from "@/types/conversation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isPopulatedConversation = (
  conversation: string | IConversation
): conversation is IConversation => {
  return typeof conversation === 'object' && 'lastActive' in conversation;
}