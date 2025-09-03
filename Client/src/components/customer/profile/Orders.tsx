import React, { useEffect } from "react";
import { type Order } from "../../../types/Order";

type OrdersProps = {
  orders?: Order[];
  onOrderClick?: (orderId: string) => void;
};

const Orders: React.FC<OrdersProps> = ({ orders, onOrderClick }) => {
  useEffect(() => {
    const tableId = "#ordersTable";

    // Destroy previous instance if exists
    if ($.fn.dataTable.isDataTable(tableId)) {
      $(tableId).DataTable().destroy();
    }

    $(tableId).DataTable();
  }, [orders]);

  return (
    <div className="table-responsive">
      <h4>My Orders</h4>
      <table className="table table-bordered table-striped" id="ordersTable">
        <thead>
          <tr>
            <th className="text-center">Order ID</th>
            <th className="text-center">Order Date</th>
            <th className="text-center">Final Cost</th>
            <th className="text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order.orderId}>
              <td className="text-center">
                <a
                  href="#"
                  className="text-center text-decoration-none order-detail-link"
                  onClick={(e) => {
                    e.preventDefault();
                    onOrderClick?.(order.orderId);
                  }}
                >
                  {order.orderId}
                </a>
              </td>
              <td className="text-center">{order.orderDate}</td>
              <td className="text-center">{order.finalCost}</td>
              <td className="text-center">{order.statusName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;