import React, { useEffect, useState } from "react";
import { type Order } from "../../../types/Order";
import OrderDetail from "./OrderDetail";

type OrdersProps = {
  orders?: Order[];
};

const Orders: React.FC<OrdersProps> = ({ orders }) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const tableId = "#ordersTable";
    if ($.fn.dataTable.isDataTable(tableId)) {
      $(tableId).DataTable().destroy();
    }
    $(tableId).DataTable();
  }, [orders]);

  return (
    <div>
      {selectedOrderId ? (
        <OrderDetail orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />
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
                  <td className="text-center">{order.orderDate}</td>
                  <td className="text-center">{order.finalCost}</td>
                  <td className="text-center">{order.statusName}</td>
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