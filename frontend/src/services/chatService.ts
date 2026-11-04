import axiosInstance from "../utils/axiosInstance";

import { ChatMessage } from "../types/Booking";

export interface ChatInfo {
  success: boolean;
  canSend: boolean;
  booking: {
    _id: string;
    status: string;
    service: string;
    dateKey: string;
    startTime: string;
    endTime: string;
    customer: { _id: string; name: string };
    artist: { _id: string; name: string };
  };
  messages: ChatMessage[];
}

export const getChat = async (bookingId: string): Promise<ChatInfo> => {
  const response = await axiosInstance.get(`/chat/${bookingId}`);

  return response.data;
};

export const sendChatMessage = async (
  bookingId: string,
  text: string,
): Promise<{ success: boolean; message: ChatMessage }> => {
  const response = await axiosInstance.post(`/chat/${bookingId}`, { text });

  return response.data;
};
