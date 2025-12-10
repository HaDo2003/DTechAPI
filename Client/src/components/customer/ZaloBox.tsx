import React from "react";
import Zalo from '../../assets/zalo.png';

const ZaloBox: React.FC = () => {
  return (
    <>
      {/* Zalo */}
      <div className="chat-widget-zalo">
        <a href="https://chat.zalo.me/" target="_blank" rel="noopener noreferrer" className="chat-btn-zalo">
          <img src={Zalo} alt="Zalo Chat" className="zalo-icon" />
        </a>
      </div>
    </>
  );
};

export default ZaloBox;
