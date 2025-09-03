import React from "react";
import { type CustomerCoupon } from "../../../types/CustomerCoupon";

type CouponProps = {
  coupons?: CustomerCoupon[];
};

const Coupons: React.FC<CouponProps> = ({ coupons }) => {
    return (
        <div>
            <h5>Coupons</h5>
            <p>Total coupons: {coupons?.length ?? 0}</p>
        </div>
    );
};

export default Coupons;