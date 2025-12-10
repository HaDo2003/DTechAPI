export interface ChatMessage {
    id?: number | null;
    senderId?: string | null;
    receiverId?: string | null;
    message?: string | null;
    timestamp: string;
}

export interface ChatList {
    senderId?: string | null;
    senderName?: string | null;
    message?: string | null;
    timestamp: string;
    avatarUrl?: string | null;
}

export interface FullChat {
    senderId?: string | null;
    senderName?: string | null;
    senderImageUrl?: string | null;
    messages?: ChatMessage[] | null;
}