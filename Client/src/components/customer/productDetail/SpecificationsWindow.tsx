import React from "react";
import { type Specification } from "../../../types/Specification";

interface SpecificationsOverlayProps {
  specifications: Specification[];
  isOpen: boolean;
  onClose: () => void;
}

const SpecificationsWindow: React.FC<SpecificationsOverlayProps> = ({
  specifications,
  isOpen,
  onClose,
}) => {

  if (!isOpen) return null;

  return (
    <div id="overlay" className="overlay" onClick={onClose}>
      <div className="mx-auto" id="SpecWindow" style={{ maxWidth: "800px" }}>
        <div className="row">
          <div className="col-10">
            <h3 className="text-start py-2">Specifications</h3>
          </div>
          <div className="col-2 text-end d-flex justify-content-end align-items-center">
            <button
              id="close"
              onClick={onClose}
              className="btn btn-outline-danger btn-sm rounded-circle fw-bold button-custom"
            >
              x
            </button>
          </div>
        </div>
        <table className="table table-striped mb-0">
          <tbody>
            {specifications.map((spec, idx) => (
              <tr key={idx} className="specification-item d-flex text-start row">
                <th className="col-3">{spec.specName}</th>
                <td className="col-9">{spec.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpecificationsWindow;