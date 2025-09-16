import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import type { CheckOut } from "../../types/Order";
import { checkOutService } from "../../services/CheckOutService";

// Component
import PaymentMethod from "../../components/customer/checkOut/PaymentMethod";
import OrderSummary from "../../components/customer/checkOut/OrderSummary";
import ShippingInformation from "../../components/customer/checkOut/ShippingInformation";
import InputForCheckOut from "../../components/customer/checkOut/InputForCheckOut";
import Loading from "../../components/shared/Loading";
import AlertForm from "../../components/customer/AlertForm";

const Checkout: React.FC = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const buyNowData = location.state as CheckOut | undefined;
    const [formData, setFormData] = useState<CheckOut>({
        email: "",
        billingName: "",
        billingPhone: "",
        billingAddress: "",
        paymentMethod: 0,
        orderSummary: {
            items: [],
            itemCount: 0,
            subTotal: 0,
            shippingFee: 0,
            discountAmount: 0,
            total: 0,
        }, customerAddresses: [],
        paymentMethods: [],
        success: true,
        message: ""
    });
    const [reductionCode, setReductionCode] = useState("");
    const [differenceAddress, setDifferenceAddress] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

    useEffect(() => {
        if (token === null) {
            navigate("/login");
            return;
        }

        if (buyNowData) {
            if (!buyNowData.paymentMethod && (buyNowData.paymentMethods?.length ?? 0) > 0) {
                const cod = buyNowData.paymentMethods!.find(pm => pm.description === "COD");
                buyNowData.paymentMethod = cod?.paymentMethodId ?? buyNowData.paymentMethods![0].paymentMethodId;
            }
            setFormData(buyNowData);
            setLoading(false);
            return;
        }

        const fetchCheckOut = async () => {
            setLoading(true);
            try {
                if (!token) {
                    setAlert({ message: "User token is missing. Please login again.", type: "error" });
                    setLoading(false);
                    return;
                }
                const data = await checkOutService.fetchCheckOut(token);
                if (data.success) {
                    if (!data.paymentMethod && (data.paymentMethods?.length ?? 0) > 0) {
                        const cod = data.paymentMethods!.find(pm => pm.description === "COD");
                        data.paymentMethod = cod?.paymentMethodId ?? data.paymentMethods![0].paymentMethodId;
                    }
                    setFormData(data);
                    setAlert(null);
                } else {
                    setAlert({ message: data.message || "Failed to load customer data.", type: "error" });
                }
            } catch (err) {
                setAlert({ message: "Failed to load customer data, please try again. " + err, type: "error" });
            } finally {
                setLoading(false);
            }
        }

        fetchCheckOut();
    }, [token, buyNowData])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }));
        } else if (type === "radio" && name === "paymentMethod") {
            setFormData((prev) => ({
                ...prev,
                [name]: Number(value),
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (token === null) {
            navigate("/login");
            return;
        }
        setLoading(true);
        try {
            const res = await checkOutService.placeOrder(
                token,
                formData,
                buyNowData ? true : false
            );
            console.log(formData);
            if (res && res.success) {
                if (res.paymentUrl) {
                    window.location.href = res.paymentUrl;
                    return;
                } else {
                    navigate(`/order-success/${res.orderId}`, { state: res });
                }
            } else {
                navigate("/order-fail");
            }
        } catch (err) {
            console.error("Place order failed:", err);
            navigate("/order-fail");
        } finally {
            setLoading(false);
        }
    };

    const handleApplyDiscount = async () => {
        if (token === null) {
            navigate("/login");
            return;
        }

        if (!reductionCode.trim()) {
            setAlert({ message: "Please enter a coupon code.", type: "error" });
            return;
        }

        let res;

        if (buyNowData) {
            res = await checkOutService.applyCoupon(token, reductionCode, {
                isBuyNow: true,
                productId: buyNowData.orderSummary?.items[0]?.productId ?? 0,
                quantity: buyNowData.orderSummary?.items[0]?.quantity ?? 1
            });
        } else {
            res = await checkOutService.applyCoupon(token, reductionCode);
        }

        if (res.success && res) {
            setFormData((prev) => ({
                ...prev,
                orderSummary: {
                    ...prev.orderSummary!,
                    discountAmount: res.discountAmount ?? prev.orderSummary!.discountAmount ?? 0,
                    total: res.total ?? prev.orderSummary!.total,
                }
            }));
            setAlert({ message: res.message || "Apply coupon successfully", type: "success" });
        } else {
            setAlert({ message: res.message || "Coupon invalid", type: "error" });
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <div className="container-fluid">
                <form onSubmit={handleSubmit} id="checkoutForm">
                    <div className="row">
                        {/* Main Content */}
                        <div className="col-lg-8">
                            {/* Billing Information */}
                            <div className="card card-order mb-4">
                                <div className="card-header card-header-order">
                                    <h5 className="mb-0">
                                        <i className="fas fa-user me-2"></i>Order Information
                                    </h5>
                                </div>
                                <div className="card-body card-body-order">
                                    <div className="row">
                                        {/* Address Select */}
                                        <div className="col-md-12 mb-3">
                                            <div className="form-floating">
                                                <select
                                                    name="customerAddress"
                                                    className="form-select"
                                                    id="customerAddressSelect"
                                                    value={formData.billingAddress}
                                                    onChange={handleChange}
                                                >
                                                    {formData?.customerAddresses?.map((address) => (
                                                        <option key={address.addressId} value={address.addressId}>
                                                            {address.fullName}, {address.address}
                                                        </option>
                                                    ))}
                                                    <option value="0">Another Address ...</option>
                                                </select>
                                                <label htmlFor="customerAddressSelect" className="form-label fs-6">
                                                    Address List
                                                </label>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <InputForCheckOut
                                            type="email"
                                            placeholder="Email"
                                            name="email"
                                            value={formData.email}
                                            readonly
                                            col="col-md-12"
                                        />

                                        {/* Name */}
                                        <InputForCheckOut
                                            type="text"
                                            placeholder="Full Name"
                                            name="billingName"
                                            value={formData.billingName}
                                            onChange={handleChange}
                                            required
                                            col="col-md-6"
                                        />

                                        {/* Phone */}
                                        <InputForCheckOut
                                            type="tel"
                                            placeholder="Phone Number"
                                            name="billingPhone"
                                            value={formData.billingPhone}
                                            onChange={handleChange}
                                            required
                                            col="col-md-6"
                                        />

                                        {/* Address */}
                                        <InputForCheckOut
                                            type="text"
                                            placeholder="Address"
                                            name="billingAddress"
                                            value={formData.billingAddress}
                                            onChange={handleChange}
                                            required
                                            col="col-md-12"
                                        />

                                        {/* Checkbox */}
                                        <div className="col-md-12">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    name="differenceAddress"
                                                    id="differenceAddress"
                                                    className="form-check-input"
                                                    checked={differenceAddress}
                                                    onChange={(e) => setDifferenceAddress(e.target.checked)}
                                                />
                                                <label className="form-check-label" htmlFor="differenceAddress">
                                                    Delivery to another address
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Info */}
                            {differenceAddress && <ShippingInformation
                                formData={{
                                    shippingName: "",
                                    shippingPhone: "",
                                    shippingAddress: "",
                                    differenceAddress: differenceAddress
                                }}
                                handleChange={handleChange}
                            />}

                            {/* Payment Method */}
                            <PaymentMethod
                                paymentMethods={formData.paymentMethods}
                                selectedMethod={formData.paymentMethod}
                                handleChange={handleChange}
                            />

                            {/* Note */}
                            <div className="card card-order mb-4">
                                <div className="card-body card-body-order">
                                    <label htmlFor="note" className="form-label">
                                        Note
                                    </label>
                                    <textarea
                                        name="note"
                                        className="form-control"
                                        rows={3}
                                        value={formData.note || ""}
                                        onChange={handleChange}
                                        placeholder="Note about the order..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <OrderSummary
                            orderSummary={formData.orderSummary}
                            reductionCode={reductionCode}
                            onReductionCodeChange={(e) => setReductionCode(e.target.value)}
                            onApplyDiscount={handleApplyDiscount}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </form>
            </div>
            {alert && (
                <AlertForm
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
        </>
    );
};

export default Checkout;
