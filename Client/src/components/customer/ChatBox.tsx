import React, { useState, useEffect, useRef } from "react";
import { type ChatMessage } from "../../types/ChatMessage";
import { useSignalR } from "../../hooks/useSignalR";
import { useAuth } from "../../context/AuthContext";
import { chatService } from "../../services/ChatService";
import { jwtDecode } from "jwt-decode";
import { type TokenPayload } from "../../utils/jwtDecoder";

const ChatBox: React.FC = () => {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("guest");
  const chatBodyRef = useRef<HTMLDivElement | null>(null);

  // -----------------------------
  // USE SIGNALR HOOK
  // -----------------------------
  const { connection } = useSignalR(token);

  // -----------------------------
  // Get user ID from token on mount
  // -----------------------------
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        if (decoded.sub) {
          setCurrentUserId(decoded.sub);
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    } else {
      setCurrentUserId("guest");
    }
  }, [token]);

  // Auto-scroll
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // -----------------------------
  // Get user ID from server after connection (backup)
  // -----------------------------
  useEffect(() => {
    if (!connection) return;

    connection.on("SetUserId", (userId: string) => {
      setCurrentUserId(userId);
    });

    return () => {
      connection?.off("SetUserId");
    };
  }, [connection]);

  // -----------------------------
  // Fetch chat history when opening chat
  // -----------------------------
  useEffect(() => {
    const fetchHistory = async () => {
      if (!isOpen || !token) return;

      try {
        const history = await chatService.getChatHistory(token);
        if (history && history.length > 0) {
          setChatMessages(history);
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    };

    fetchHistory();
  }, [isOpen, token]);

  // -----------------------------
  // Listen for messages
  // -----------------------------
  useEffect(() => {
    if (!connection) return;

    connection.on("ReceiveMessage", (senderId: string | null, message: string) => {
      setChatMessages(prev => [
        ...prev,
        {
          senderId: senderId || "guest",
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
  // Send message
  // -----------------------------
  const handleSend = async () => {
    if (!inputValue.trim() || !connection) return;

    // Server handles the admin ID
    // await connection.invoke("SendMessage", null, inputValue);
    await chatService.sendMessage(inputValue, connection);

    const newMessage: ChatMessage = {
      senderId: currentUserId,
      message: inputValue,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setInputValue("");
  };

  return (
    <>
      {/* Floating Chat */}
      <div className="chat-widget">
        <button className="chat-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle chat window">
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
                <button className="btn btn-danger" onClick={handleSend} aria-label="Send message">
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

export default ChatBox;