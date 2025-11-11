import React from "react";
import { Link } from "react-router-dom";
import type { CustomerMonitor } from "../../../types/Customer";
import { timeFormatter } from "../../../utils/timeFormatter";

interface LatestMembersProps {
  customers: CustomerMonitor[];
}

const UserList: React.FC<LatestMembersProps> = ({ customers }) => {
  const count = customers.length;

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
                  to={`/admin/customer/detail/${customer.userId}`}
                  className="btn fw-bold fs-7 text-secondary text-truncate w-100 p-0"
                >
                  {customer.userName}
                </Link>
                <div className="fs-8">{timeFormatter(customer.createdAt ?? "")}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Card Footer */}
        <div className="card-footer text-center">
          <Link
            to="/admin/customer"
            className="btn btn-sm btn-secondary float-end"
          >
            View All Users
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserList;
