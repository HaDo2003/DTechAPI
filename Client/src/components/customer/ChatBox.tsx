import React, { useState, useEffect, useRef } from "react";

export interface ChatMessage {
  id: string;
  senderId: string;
  message: string;
  timestamp: string;
};

type FullChatProps = {
  currentUserId: string;
  messages: ChatMessage[];
};

const ChatWidget: React.FC<FullChatProps> = ({ currentUserId, messages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(messages || []);
  const chatBodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // auto-scroll to bottom when messages change
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUserId,
      message: inputValue,
      timestamp: new Date().toISOString(),
    };

    setChatMessages([...chatMessages, newMessage]);
    setInputValue("");
  };

  return (
    <>
      {/* Redirect to Zalo Chat */}
      <div className="chat-widget-zalo">
        <a href="https://chat.zalo.me/" target="_blank" rel="noopener noreferrer" className="chat-btn-zalo">
          <img src="/img/zalo.png" alt="Zalo Chat" className="zalo-icon" />
        </a>
      </div>

      {/* Chat Widget */}
      <div className="chat-widget">
        <button className="btn chat-btn" onClick={() => setIsOpen(!isOpen)}>
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

            <div className="chat-body" id="chatBody" ref={chatBodyRef}>
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

            <div className="chat-footer">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
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
