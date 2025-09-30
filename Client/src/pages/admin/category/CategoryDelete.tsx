import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { adminService } from "../../../services/AdminService";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";
import DeletePage from "../DeletePage";
import type { CategoryForm } from "../../../types/Category";

const CategoryDelete: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [data, setData] = useState<CategoryForm | null>(null);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            (async () => {
                const res = await adminService.getSingleData<CategoryForm>(`/api/category/get/${id}`, token ?? "");
                if (res.success && res.data) {
                    const category = res.data as CategoryForm;
                    setData(category);
                }
            })();
        }
    }, [id, token]);

    const handleDelete = async () => {
        setLoading(true);
        const res = await adminService.deleteData(`/api/category/delete`, id ?? "", token ?? "");
        if (res.success) {
            setLoading(false);
            navigate("/admin/category", {
                state: {
                    alert: {
                        message: "Category deleted successfully!",
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
        navigate("/admin/category");
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

            <DeletePage<CategoryForm>
                entityName="Category"
                data={data}
                fields={[
                    { key: "name", label: "Name" },
                    { key: "slug", label: "Slug" },
                    { key: "parentName", label: "Parent Category" },
                    { key: "status", label: "Status" },
                ]}
                onDelete={handleDelete}
                onCancel={handleCancel}
            />
        </>
    );
};

export default CategoryDelete;
