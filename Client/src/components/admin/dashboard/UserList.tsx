import React from "react";
import { Link } from "react-router-dom";

interface Customer {
  image: string;
  fullName: string;
  createDate: string; // ISO string from API
}

interface LatestMembersProps {
  customers: Customer[];
}

const UserList: React.FC<LatestMembersProps> = ({ customers }) => {
  const count = customers.length;

  // Format date similar to Razor "d MMMM yyyy"
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="col-md-6">
      <div className="card">
        {/* Card Header */}
        <div className="card-header">
          <h3 className="card-title">Latest Members</h3>

          <div className="card-tools">
            {count > 0 && (
              <span className="badge text-bg-danger">{count} New Members</span>
            )}
            <button type="button" className="btn btn-tool">
              <i className="bi bi-dash-lg"></i>
            </button>
            <button type="button" className="btn btn-tool">
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="card-body p-0">
          <div className="row text-center m-1">
            {customers.map((customer, index) => (
              <div className="col-3 p-2" key={index}>
                <img
                  className="img-fluid rounded-circle"
                  src={customer.image}
                  alt="User"
                />
                <Link
                  to="#"
                  className="btn fw-bold fs-7 text-secondary text-truncate w-100 p-0"
                >
                  {customer.fullName}
                </Link>
                <div className="fs-8">{formatDate(customer.createDate)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Card Footer */}
        <div className="card-footer text-center">
          <Link
            to="#"
            className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
          >
            View All Users
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserList;
