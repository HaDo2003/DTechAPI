import React from "react";
import { Link } from "react-router-dom";
import type { OrderMonitor } from "../../../types/Order";

interface LatestOrdersProps {
  orders: OrderMonitor[];
}

const LatestOrder: React.FC<LatestOrdersProps> = ({ orders }) => {
  // Map statusId → badge style
  const getStatusBadge = (description: string) => {
    switch (description) {
      case "Order Placed":
        return <span className="badge text-bg-info">{description}</span>;
      case "Order Processing":
      case "Shipped":
      case "Out for Delivery":
        return <span className="badge text-bg-primary">{description}</span>;
      case "Delivered":
      case "Order Completed":
        return <span className="badge text-bg-success">{description}</span>;
      case "Order Canceled":
        return <span className="badge text-bg-warning">{description}</span>;
      case "Order Returned":
        return <span className="badge text-bg-danger">{description}</span>;
      default:
        return <span className="badge text-bg-secondary">{description}</span>;
    }
  };

  return (
    <div className="card mb-4">
      {/* Card Header */}
      <div className="card-header">
        <h3 className="card-title">Latest Orders</h3>
        <div className="card-tools">
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
        <div className="table-responsive">
          <table className="table m-0">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>
                    <Link
                      to={`/admin/order/detail/${order.orderId}`}
                      className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                    >
                      {order.orderId}
                    </Link>
                  </td>
                  <td>{order.customerName ?? "N/A"}</td>
                  <td>
                    {order.status
                      ? getStatusBadge(order.status)
                      : "N/A"}
                  </td>
                  <td>
                    {order.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card Footer */}
      <div className="card-footer clearfix">
        <Link to="/admin/order" className="btn btn-sm btn-secondary float-end">
          View All Orders
        </Link>
      </div>
    </div>
  );
};

export default LatestOrder;
