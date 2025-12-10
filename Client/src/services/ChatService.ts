import axios from "axios";
import * as signalR from "@microsoft/signalr";
import { type ChatList, type ChatMessage, type FullChat } from "../types/ChatMessage";
import { handleAxiosError } from "../utils/handleAxiosError";

export const chatService = {
    async getChatHistory(token?: string): Promise<ChatMessage[]> {
        try {
            const response = await axios.get<ChatMessage[]>(`/api/chat/fetch-chat-history`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            return response.data || [];
        } catch (err: any) {
            throw handleAxiosError(err, "Failed to fetch chat history. Please try again.");
        }
    },

    async getChatList(token?: string): Promise<ChatList[]> {
        try {
            const res = await axios.get<ChatList[]>(`/api/chat/admin/chat-list`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            return res.data || [];
        } catch (err: any) {
            throw handleAxiosError(err, "Failed to fetch chat list. Please try again.");
        }
    },

    async getFullChat(senderId: string, token?: string): Promise<FullChat> {
        try {
            const res = await axios.get<FullChat[]>(`/api/chat/admin/full-chat/${senderId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            return res.data?.[0] || { messages: [] };
        } catch (err: any) {
            throw handleAxiosError(err, "Failed to fetch full chat. Please try again.");
        }
    },

    async sendMessage(message: string, connection: signalR.HubConnection, receiverId?: string) {
        return connection.invoke("SendMessage", receiverId, message);
    }
};