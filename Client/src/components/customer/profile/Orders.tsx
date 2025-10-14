import React, { useEffect, useState } from "react";
import { type Order } from "../../../types/Order";
import OrderDetail from "./OrderDetail";
import { timeFormatter } from "../../../utils/timeFormatter";

type OrdersProps = {
  orders?: Order[];
  onRefresh?: () => Promise<void>;
};

const Orders: React.FC<OrdersProps> = ({ orders, onRefresh }) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedOrderId === null) {
      const tableId = "#ordersTable";
      if ($.fn.dataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
      }
      const timeout = setTimeout(() => {
        if (orders && orders.length > 0) {
          $(tableId).DataTable({
            order: [[1, "desc"]],
            pageLength: 8,
            destroy: true,
          });
        }
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [orders, selectedOrderId]);

  const statusColor = (status: string) => {
    switch (status) {
      case "Order Placed":
        return "text-primary fw-bold";

      case "Order Processing":
      case "Shipped":
      case "Out for Delivery":
        return "text-info fw-bold";

      case "Delivered":
      case "Order Completed":
        return "text-success fw-bold";

      case "Order Canceled":
      case "Order Returned":
        return "text-danger fw-bold";

      default:
        return "";
    }
  };

  return (
    <div>
      {selectedOrderId ? (
        <OrderDetail
          orderId={selectedOrderId}
          onClose={() => {
            setSelectedOrderId(null);
            onRefresh?.();
          }}
          onRefresh={onRefresh}
        />
      ) : (
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
                        setSelectedOrderId(order.orderId);
                      }}
                    >
                      {order.orderId}
                    </a>
                  </td>
                  <td className="text-center">{timeFormatter(order.orderDate)}</td>
                  <td className="text-center">{order.finalCost}</td>
                  <td className={`text-center ${statusColor(order.statusName)}`}>
                    {order.statusName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;