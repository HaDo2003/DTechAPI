import React from "react";

const OrderFail: React.FC = () => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mt-5">
            <div className="card-body text-center py-5">
              <div className="mb-4">
                <i
                  className="fa-regular fa-circle-xmark text-danger"
                  style={{ fontSize: "4rem" }}
                ></i>
              </div>
              <h2 className="text-danger mb-3">Order Fail</h2>
              <p className="lead mb-4">{status}</p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <a href="/" className="btn btn-primary me-md-2">
                  <i className="fas fa-home me-2"></i>Back to Home
                </a>
                <a href="/orders" className="btn btn-outline-primary">
                  <i className="fas fa-list me-2"></i>Order Information
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFail;
