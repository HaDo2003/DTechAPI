import React, { useEffect, useState } from "react";
import { chatService } from "../../services/ChatService";
import { useSignalR } from "../../hooks/useSignalR";
import DetailChatBox from "../../components/admin/DetailChatBox";
import type { ChatList, FullChat } from "../../types/ChatMessage";
import { useAuth } from "../../context/AuthContext";

const CustomerSupport: React.FC = () => {
    const {token} = useAuth();
    const [chatList, setChatList] = useState<ChatList[]>([]);
    const [selectedChat, setSelectedChat] = useState<FullChat | null>(null);
    const [unreadChats, setUnreadChats] = useState<Set<string>>(new Set());
    const { connection } = useSignalR(token);

    // Load chat preview list
    useEffect(() => {
        if (token) {
            chatService.getChatList(token).then(setChatList);
        }
    }, [token]);

    // Listen for new messages and update chat list
    useEffect(() => {
        if (!connection) return;

        const handler = (senderId: string | null, message: string) => {
            if (!senderId) return;

            // Update chat list with new message
            setChatList(prev => {
                const existingIndex = prev.findIndex(chat => chat.senderId === senderId);
                const updatedChat: ChatList = {
                    senderId,
                    senderName: existingIndex >= 0 ? prev[existingIndex].senderName : "Unknown",
                    avatarUrl: existingIndex >= 0 ? prev[existingIndex].avatarUrl : null,
                    message,
                    timestamp: new Date().toISOString()
                };

                if (existingIndex >= 0) {
                    // Move to top and update
                    const newList = [...prev];
                    newList.splice(existingIndex, 1);
                    return [updatedChat, ...newList];
                } else {
                    // Add new chat to top
                    return [updatedChat, ...prev];
                }
            });

            // Mark as unread if not currently selected
            if (selectedChat?.senderId !== senderId) {
                setUnreadChats(prev => new Set(prev).add(senderId));
            }
        };

        connection.on("ReceiveMessage", handler);

        return () => {
            connection.off("ReceiveMessage", handler);
        };
    }, [connection, selectedChat]);

    // Click → load full chat
    const loadChat = async (senderId: string) => {
        if (!token) return;
        const data = await chatService.getFullChat(senderId, token);
        setSelectedChat(data);

        // Mark as read
        setUnreadChats(prev => {
            const newSet = new Set(prev);
            newSet.delete(senderId);
            return newSet;
        });
    };

    return (
        <div className="app-wrapper">
            <main className="app-main">
                <div className="container-fluid">
                    <h3>Customer Support</h3>

                    <div className="row mt-4">
                        {/* LEFT SIDE: PREVIEW LIST */}
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">List of Chat</h3>
                                </div>

                                <div className="card-body">
                                    {chatList.map((chat, index) => {
                                        const isUnread = chat.senderId && unreadChats.has(chat.senderId);
                                        const isActive = selectedChat?.senderId === chat.senderId;
                                        return (
                                            <div
                                                key={chat.senderId || index}
                                                className={`chat-preview d-flex align-items-center mb-3 ${
                                                    isActive ? "active" : ""
                                                }`}
                                                onClick={() => chat.senderId && loadChat(chat.senderId)}
                                                style={{
                                                    cursor: 'pointer',
                                                    backgroundColor: isUnread ? '#f0f8ff' : 'transparent',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    position: 'relative'
                                                }}
                                            >
                                                <div style={{ position: 'relative' }}>
                                                    <img
                                                        alt={chat.senderName || "User"}
                                                        src={chat.avatarUrl || "/assets/default-avatar.jpg"}
                                                        className="rounded-circle"
                                                        style={{ width: 48, height: 48, objectFit: 'cover' }}
                                                    />
                                                    {isUnread && (
                                                        <span
                                                            style={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                right: 0,
                                                                width: '12px',
                                                                height: '12px',
                                                                backgroundColor: '#dc3545',
                                                                borderRadius: '50%',
                                                                border: '2px solid white'
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <div className="ms-3" style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: isUnread ? 'bold' : 'normal' }}>
                                                        {chat.senderName || "Unknown"}
                                                    </div>
                                                    <div
                                                        className="text-muted text-truncate"
                                                        style={{
                                                            maxWidth: 250,
                                                            fontWeight: isUnread ? '600' : 'normal'
                                                        }}
                                                    >
                                                        {chat.message || ""}
                                                    </div>
                                                    <small className="text-secondary">{new Date(chat.timestamp).toLocaleString()}</small>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE: FULL CHAT WINDOW */}
                        <div className="col-lg-6">
                            {selectedChat && connection && token ? (
                                <DetailChatBox
                                    senderId={selectedChat.senderId}
                                    senderName={selectedChat.senderName}
                                    senderImageUrl={selectedChat.senderImageUrl}
                                    currentUserId={token ? JSON.parse(atob(token.split('.')[1])).nameid : ""}
                                    messages={selectedChat.messages}
                                    connection={connection}
                                />
                            ) : (
                                <p className="text-muted">Select a chat to start</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CustomerSupport;