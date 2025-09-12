import React from "react";
import InputForCheckOut from "./InputForCheckOut";

interface ShippingInfoProps {
  formData: {
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    differenceAddress: boolean;
  };
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const ShippingInformation: React.FC<ShippingInfoProps> = ({
  formData,
  handleChange,
}) => {
  return (
    <div
      className="card card-order mb-4"
      id="shipping-section"
      style={{ display: formData.differenceAddress ? "block" : "none" }}
    >
      <div className="card-header card-header-order">
        <h5 className="mb-0">
          <i className="fas fa-truck me-2"></i>Delivery Address
        </h5>
      </div>
      <div className="card-body card-body-order">
        <div className="row">
          {/* Consignee Name */}
          <InputForCheckOut
            type="text"
            placeholder="Consignee Name"
            name="shippingName"
            value={formData.shippingName}
            onChange={handleChange}
            required={formData.differenceAddress}
            col="col-md-6"
          />

          {/* Phone */}
          <InputForCheckOut
            type="tel"
            placeholder="Phone Number"
            name="shippingPhone"
            value={formData.shippingPhone}
            onChange={handleChange}
            required={formData.differenceAddress}
            col="col-md-6"
          />

          {/* Address */}
          <InputForCheckOut
            type="texr"
            placeholder="Address"
            name="shippingAddress"
            value={formData.shippingAddress}
            onChange={handleChange}
            required={formData.differenceAddress}
            col="col-md-12"
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingInformation;
