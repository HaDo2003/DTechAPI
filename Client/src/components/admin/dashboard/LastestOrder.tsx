import React from "react";
import { Link } from "react-router-dom";

// Types
interface Status {
  statusId: number;
  description: string;
}

interface Customer {
  fullName: string;
}

interface OrderProduct {
  quantity: number;
}

interface Order {
  orderId: number;
  customer?: Customer;
  status?: Status;
  orderProducts: OrderProduct[];
}

interface LatestOrdersProps {
  orders: Order[];
}

const LatestOrder: React.FC<LatestOrdersProps> = ({ orders }) => {
  // Map statusId → badge style
  const getStatusBadge = (statusId: number, description: string) => {
    switch (statusId) {
      case 1:
        return <span className="badge text-bg-info">{description}</span>;
      case 2:
      case 3:
      case 4:
        return <span className="badge text-bg-primary">{description}</span>;
      case 5:
      case 6:
        return <span className="badge text-bg-success">{description}</span>;
      case 7:
        return <span className="badge text-bg-warning">{description}</span>;
      case 8:
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
                      to={`/orders/${order.orderId}`}
                      className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                    >
                      {order.orderId}
                    </Link>
                  </td>
                  <td>{order.customer?.fullName ?? "N/A"}</td>
                  <td>
                    {order.status
                      ? getStatusBadge(order.status.statusId, order.status.description)
                      : "N/A"}
                  </td>
                  <td>
                    {order.orderProducts.reduce(
                      (sum, op) => sum + op.quantity,
                      0
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card Footer */}
      <div className="card-footer clearfix">
        <Link to="/orders" className="btn btn-sm btn-secondary float-end">
          View All Orders
        </Link>
      </div>
    </div>
  );
};

export default LatestOrder;
