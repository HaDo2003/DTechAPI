import React from "react";

interface Message {
  id: number;
  name: string;
  timestamp: string;
  text: string;
  img: string;
  isOwn?: boolean;
}

interface Contact {
  id: number;
  name: string;
  img: string;
  date: string;
  lastMsg: string;
}

interface DirectChatProps {
  messages: Message[];
  contacts: Contact[];
}

const DirectChat: React.FC<DirectChatProps> = ({ messages, contacts }) => {
  return (
    <div className="col-md-6">
      {/* Direct Chat */}
      <div className="card direct-chat direct-chat-warning">
        {/* Card Header */}
        <div className="card-header">
          <h3 className="card-title">Direct Chat</h3>

          <div className="card-tools">
            <span title="3 New Messages" className="badge text-bg-warning">
              3
            </span>
            <button type="button" className="btn btn-tool">
              <i className="bi bi-dash-lg"></i>
            </button>
            <button type="button" className="btn btn-tool" title="Contacts">
              <i className="bi bi-chat-text-fill"></i>
            </button>
            <button type="button" className="btn btn-tool">
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="card-body">
          {/* Messages */}
          <div className="direct-chat-messages">
            {(messages || []).map((msg) => (
              <div
                key={msg.id}
                className={`direct-chat-msg ${msg.isOwn ? "end" : ""}`}
              >
                <div className="direct-chat-infos clearfix">
                  <span
                    className={`direct-chat-name ${
                      msg.isOwn ? "float-end" : "float-start"
                    }`}
                  >
                    {msg.name}
                  </span>
                  <span
                    className={`direct-chat-timestamp ${
                      msg.isOwn ? "float-start" : "float-end"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                <img
                  className="direct-chat-img"
                  src={msg.img}
                  alt={`${msg.name} avatar`}
                />
                <div className="direct-chat-text">{msg.text}</div>
              </div>
            ))}
          </div>

          {/* Contacts */}
          <div className="direct-chat-contacts">
            <ul className="contacts-list">
              {(contacts || []).map((c) => (
                <li key={c.id}>
                  <a href="#">
                    <img
                      className="contacts-list-img"
                      src={c.img}
                      alt={`${c.name} avatar`}
                    />
                    <div className="contacts-list-info">
                      <span className="contacts-list-name">
                        {c.name}
                        <small className="contacts-list-date float-end">
                          {c.date}
                        </small>
                      </span>
                      <span className="contacts-list-msg">{c.lastMsg}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Card Footer */}
        <div className="card-footer">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: hook message send handler
            }}
          >
            <div className="input-group">
              <input
                type="text"
                name="message"
                placeholder="Type Message ..."
                className="form-control"
              />
              <button type="submit" className="btn btn-warning">
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DirectChat;
