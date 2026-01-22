import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import type { ChatMessage, FullChat } from "../../types/ChatMessage";

interface DetailChatBoxProps extends FullChat {
    currentUserId: string;
    connection: signalR.HubConnection;
    onClose?: () => void;
}

const DetailChatBox: React.FC<DetailChatBoxProps> = ({
    senderId,
    senderName,
    senderImageUrl,
    currentUserId,
    messages,
    connection,
    onClose
}) => {
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>(messages || []);
    const [inputMessage, setInputMessage] = useState("");
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Update messages when prop changes (switching between chats)
    useEffect(() => {
        setChatMessages(messages || []);
    }, [messages]);

    // Scroll to bottom
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    // Receive real-time messages
    useEffect(() => {
        const handler = (incomingSenderId: string | null, message: string, timestamp: string) => {
            // Accept messages from the customer or from self (admin)
            if (incomingSenderId === senderId || incomingSenderId === currentUserId) {
                setChatMessages(prev => [
                    ...prev,
                    { senderId: incomingSenderId, receiverId: incomingSenderId === senderId ? currentUserId : senderId, message, timestamp: timestamp || new Date().toISOString() }
                ]);
            }
        };

        connection.on("ReceiveMessage", handler);

        return () => {
            connection.off("ReceiveMessage", handler);
        };
    }, [connection, senderId, currentUserId]);

    // Send a new message
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || !senderId) return;

        // Admin sends to customer (senderId is the customer's ID)
        await connection.invoke("SendMessage", senderId, inputMessage);

        setChatMessages(prev => [
            ...prev,
            { senderId: currentUserId, receiverId: senderId, message: inputMessage, timestamp: new Date().toISOString() }
        ]);

        setInputMessage("");
    };

    return (
        <div className="card">
            {/* Header */}
            <div className="card-header">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <img
                            alt={senderName ?? undefined}
                            src={senderImageUrl ?? undefined}
                            className="rounded-circle me-2"
                            style={{ width: 40, height: 40, objectFit: "cover" }}
                        />
                        <h3 className="card-title mb-0">{senderName}</h3>
                    </div>
                    {onClose && (
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                        />
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="card-body p-0" style={{ height: "25em" }}>
                <div
                    id="chat-container"
                    ref={chatContainerRef}
                    className="p-3 h-100 overflow-auto"
                >
                    {(chatMessages || [])
                        .sort((a, b) =>
                            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                        )
                        .map((chat, index) => {
                            const isMine = chat.senderId !== senderId;
                            return (
                                <div
                                    key={index}
                                    className={`d-flex ${isMine ? "justify-content-end" : "justify-content-start"
                                        } mb-2`}
                                >
                                    <div
                                        className={`p-2 ${isMine
                                                ? "bg-primary text-white"
                                                : "bg-secondary-subtle text-dark"
                                            }`}
                                        style={{
                                            maxWidth: "60%",
                                            borderRadius: "30px",
                                            wordWrap: "break-word",
                                            overflowWrap: "break-word",
                                            hyphens: "auto"
                                        }}
                                    >
                                        {chat.message}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Footer (send box) */}
            <div className="card-footer">
                <form className="pt-2 d-flex" style={{ gap: 10 }} onSubmit={handleSend}>
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        className="form-control"
                        placeholder="Type a message..."
                        required
                    />
                    <button type="submit" className="btn btn-primary">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DetailChatBox;
