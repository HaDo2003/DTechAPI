import React from "react";
import { type Order } from "../../../types/Order";

type OrdersProps = {
  orders?: Order[];
};

const Orders: React.FC<OrdersProps> = ({ orders }) => {
  return (
    <div>
      <h5>Orders</h5>
    </div>
  );
};

export default Orders;