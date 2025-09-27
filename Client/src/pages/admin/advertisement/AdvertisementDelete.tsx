import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { adminService } from "../../../services/AdminService";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";
import DeletePage from "../DeletePage";
import type { AdvertisementForm } from "../../../types/Advertisment";

const AdvertisementDelete: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [data, setData] = useState<AdvertisementForm | null>(null);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            (async () => {
                const res = await adminService.getSingleData<AdvertisementForm>(`/api/advertisement/get/${id}`, token ?? "");
                if (res.success && res.data) {
                    const ad = res.data as AdvertisementForm;
                    setData({
                        ...ad,
                        statusName: ad.status === 1 ? "Available" : "Unavailable",
                    });
                }
            })();
        }
    }, [id, token]);

    const handleDelete = async () => {
        setLoading(true);
        const res = await adminService.deleteData(`/api/advertisement/delete`, id ?? "", token ?? "");
        if (res.success) {
            setLoading(false);
            navigate("/admin/advertisement", {
                state: {
                    alert: {
                        message: "Advertisement deleted successfully!",
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
        navigate("/admin/advertisement");
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
            <DeletePage<AdvertisementForm>
                entityName="Admin Account"
                data={data}
                fields={[
                    { key: "name", label: "Name" },
                    { key: "slug", label: "Slug" },
                    { key: "order", label: "Order" },
                    { key: "statusName", label: "Status" },
                ]}
                imageKey="image"
                onDelete={handleDelete}
                onCancel={handleCancel}
            />
        </>
    );
};

export default AdvertisementDelete;
