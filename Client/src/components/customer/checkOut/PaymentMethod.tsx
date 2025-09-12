import React from "react";

interface Payment {
  paymentMethodId: number;
  description: string;
}

interface PaymentMethodProps {
  paymentMethods?: Payment[];
  selectedMethod?: number | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  paymentMethods,
  selectedMethod,
  handleChange,
}) => {
  return (
    <div className="card card-order mb-4">
      <div className="card-header card-header-order">
        <h5 className="mb-0">
          <i className="fas fa-credit-card me-2"></i>Payment Method
        </h5>
      </div>
      <div className="card-body card-body-order">
        {paymentMethods?.map((payment) => {
          const isCOD = payment.description === "COD";
          return (
            <div className="form-check mb-2" key={payment.paymentMethodId}>
              <input
                type="radio"
                name="paymentMethod"
                className="form-check-input"
                id={`payment_${payment.paymentMethodId}`}
                value={payment.paymentMethodId}
                checked={
                  selectedMethod === payment.paymentMethodId ||
                  (isCOD && selectedMethod === null)
                }
                onChange={handleChange}
              />
              <label
                className="form-check-label"
                htmlFor={`payment_${payment.paymentMethodId}`}
              >
                <strong>{payment.description}</strong>
              </label>
            </div>
          );
        })}
        <span className="text-danger">
          {/* TODO: Validation message if needed */}
        </span>
      </div>
    </div>
  );
};

export default PaymentMethod;
