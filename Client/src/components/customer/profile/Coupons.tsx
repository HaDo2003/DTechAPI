import React, { useEffect } from "react";
import { type CustomerCoupon } from "../../../types/CustomerCoupon";

type CouponProps = {
    coupons?: CustomerCoupon[];
};

const Coupons: React.FC<CouponProps> = ({ coupons }) => {
    useEffect(() => {
        const tableId = "#couponTable";

        // Destroy previous instance if exists
        if ($.fn.dataTable.isDataTable(tableId)) {
            $(tableId).DataTable().destroy();
        }

        $(tableId).DataTable();
    }, [coupons]);

    return (
        <div className="table-responsive">
            <h4>My Coupons</h4>
            <table
                id="couponTable"
                className="table table-bordered table-striped"
            >
                <thead>
                    <tr>
                        <th className="text-center">Code</th>
                        <th className="text-center">Discount</th>
                        <th className="text-center">Condition</th>
                    </tr>
                </thead>
                <tbody>
                    {coupons?.map((coupon) => (
                        <tr key={coupon.couponId}>
                            <td className="text-center">{coupon.code}</td>
                            <td className="text-center">{coupon.discount}</td>
                            <td className="text-center">{coupon.condition}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Coupons;