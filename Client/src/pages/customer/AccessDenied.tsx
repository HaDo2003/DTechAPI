import React from "react";
import { Link } from "react-router-dom";

const AccessDenied: React.FC = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-danger">
            <div className="card-header bg-danger text-white">
              <h2 className="text-center mb-0">Access Denied</h2>
            </div>
            <div className="card-body text-center">
              <i className="fas fa-exclamation-triangle fa-5x text-danger mb-3"></i>
              <h4>You do not have permission to access this resource.</h4>
              <p className="mb-4">
                Please contact your administrator if you believe this is a mistake.
              </p>
              <Link to="/" className="btn btn-primary">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
