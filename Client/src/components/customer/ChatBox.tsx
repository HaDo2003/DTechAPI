import React, { useState, useEffect, useRef } from "react";
import Zalo from '../../assets/zalo.png';
import { type ChatMessage } from "../../types/ChatMessage";
import { useSignalR } from "../../hooks/useSignalR";

type FullChatProps = {
  currentUserId: string;   // Customer ID
  adminId: string;         // Admin ID
  messages: ChatMessage[];
};

const ChatWidget: React.FC<FullChatProps> = ({ currentUserId, adminId, messages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(messages || []);

  const chatBodyRef = useRef<HTMLDivElement | null>(null);

  // -----------------------------
  // ⭐ USE YOUR SIGNALR HOOK
  // -----------------------------
  const hubUrl = "https://localhost:7094/hubs/chatsHub";
  const { connection, connected } = useSignalR(hubUrl, () => localStorage.getItem("token"));

  // Auto-scroll
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // -----------------------------
  // 📥 Listen for messages
  // -----------------------------
  useEffect(() => {
    if (!connection) return;

    connection.on("ReceiveMessage", (senderId: string, message: string) => {
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          senderId,
          message,
          timestamp: new Date().toISOString()
        }
      ]);
    });

    return () => {
      connection?.off("ReceiveMessage");
    };
  }, [connection]);

  // -----------------------------
  // 📤 Send message
  // -----------------------------
  const handleSend = async () => {
    if (!inputValue.trim() || !connection) return;

    await connection.invoke("SendMessage", adminId, inputValue);

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUserId,
      message: inputValue,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setInputValue("");
  };

  return (
    <>
      {/* Zalo */}
      <div className="chat-widget-zalo">
        <a href="https://chat.zalo.me/" target="_blank" rel="noopener noreferrer" className="chat-btn-zalo">
          <img src={Zalo} alt="Zalo Chat" className="zalo-icon" />
        </a>
      </div>

      {/* Floating Chat */}
      <div className="chat-widget">
        <button className="chat-btn" onClick={() => setIsOpen(!isOpen)}>
          <i className="fas fa-comments"></i>
        </button>

        {isOpen && (
          <div className="chat-window">

            <div className="chat-header">
              <h6 className="mb-0">
                <i className="fas fa-headset me-2"></i>
                Chat Support
              </h6>
            </div>

            {/* ⭐ Connection status */}
            <div
              style={{
                padding: "5px",
                fontSize: "12px",
                color: connected ? "green" : "red",
              }}
            >
              {connected ? "Connect success" : "Connecting..."}
            </div>

            <div className="chat-body" ref={chatBodyRef}>
              {chatMessages.length === 0 ? (
                <div className="message">
                  <div className="bot-message">Hello! How can I help you ?</div>
                </div>
              ) : (
                chatMessages
                  .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                  .map((chat) => {
                    const isMine = chat.senderId === currentUserId;
                    return (
                      <div className="message" key={chat.id}>
                        <div className={isMine ? "user-message" : "bot-message"}>
                          {chat.message}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            {/* Footer */}
            <div className="chat-footer">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Text..."
                />
                <button className="btn btn-danger" onClick={handleSend}>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
};

export default ChatWidget;
