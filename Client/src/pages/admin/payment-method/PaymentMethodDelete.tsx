import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { adminService } from "../../../services/AdminService";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";
import DeletePage from "../DeletePage";
import type { PaymentMethodForm } from "../../../types/PaymentMethod";

const PaymentMethodDelete: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [data, setData] = useState<PaymentMethodForm | null>(null);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            (async () => {
                const res = await adminService.getSingleData<PaymentMethodForm>(`/api/paymentmethod/get/${id}`, token ?? "");
                if (res) {
                    setData(res as unknown as PaymentMethodForm);
                }
            })();
        }
    }, [id, token]);

    const handleDelete = async () => {
        setLoading(true);
        const res = await adminService.deleteData(`/api/paymentMethod/delete`, id ?? "", token ?? "");
        if (res.success) {
            setLoading(false);
            navigate("/admin/payment-method", {
                state: {
                    alert: {
                        message: "Payment Method deleted successfully!",
                        type: "success",
                    },
                },
            });
        } else {
            setLoading(false);
            setAlert({ message: res.message || "Delete failed!", type: "error" });
        }
    };

    const handleCancel = () => {
        navigate("/admin/payment-method");
    };

    if (!data) {
        return <Loading />;
    }

    return (
        <>
            {alert && (
                <AlertForm
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}

            {loading && (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                    <Loading />
                </div>
            )}

            <DeletePage<PaymentMethodForm>
                entityName="Payment Method"
                data={data}
                fields={[
                    { key: "description", label: "Description" },
                    { key: "createDate", label: "Created Date" },
                    { key: "createdBy", label: "Created By" },
                    { key: "updateDate", label: "Updated Date" },
                    { key: "updatedBy", label: "Updated By" },
                ]}
                onDelete={handleDelete}
                onCancel={handleCancel}
            />
        </>
    );
};

export default PaymentMethodDelete;
