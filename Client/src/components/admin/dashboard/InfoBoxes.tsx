import React from "react";

interface InfoBoxProps {
  icon: string;
  color: string;
  title: string;
  value: string | number;
  unit?: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({ icon, color, title, value, unit }) => (
  <div className="col-12 col-sm-6 col-md-3">
    <div className="info-box">
      <span className={`info-box-icon text-bg-${color} shadow-sm`}>
        <i className={`bi ${icon}`} />
      </span>

      <div className="info-box-content">
        <span className="info-box-text">{title}</span>
        <span className="info-box-number">
          {value} {unit && <small>{unit}</small>}
        </span>
      </div>
    </div>
  </div>
);

const InfoBoxes: React.FC = () => {
  return (
    <div className="row">
      <InfoBox icon="bi-gear-fill" color="primary" title="CPU Traffic" value={10} unit="%" />
      <InfoBox icon="bi-hand-thumbs-up-fill" color="danger" title="Likes" value="41,410" />
      <InfoBox icon="bi-cart-fill" color="success" title="Sales" value={760} />
      <InfoBox icon="bi-people-fill" color="warning" title="New Members" value="2,000" />
    </div>
  );
};

export default InfoBoxes;
