import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { adminService } from "../../../services/AdminService";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";
import DeletePage from "../DeletePage";
import type { ProductForm } from "../../../types/Product";

const ProductDelete: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [data, setData] = useState<ProductForm | null>(null);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            (async () => {
                const res = await adminService.getSingleData<ProductForm>(`/api/product/get/${id}`, token ?? "");
                if (res.success && res.data) {
                    const product = res.data as ProductForm;
                    setData({
                        ...product,
                        // Convert boolean statusProduct into a readable string
                        statusProduct: product.statusProduct ?? false,
                    });
                }
            })();
        }
    }, [id, token]);

    const handleDelete = async () => {
        setLoading(true);
        const res = await adminService.deleteData(`/api/product/delete`, id ?? "", token ?? "");
        if (res.success) {
            setLoading(false);
            navigate("/admin/product", {
                state: {
                    alert: {
                        message: "Product deleted successfully!",
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
        navigate("/admin/product");
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

            <DeletePage<ProductForm>
                entityName="Product"
                data={data}
                fields={[
                    { key: "name", label: "Name" },
                    { key: "slug", label: "Slug" },
                    { key: "warranty", label: "Warranty" },
                    { key: "price", label: "Price" },
                    { key: "discount", label: "Discount" },
                    { key: "priceAfterDiscount", label: "Price After Discount" },
                    { key: "endDateDiscount", label: "Discount End Date" },
                    { key: "dateOfManufacture", label: "Date of Manufacture" },
                    { key: "madeIn", label: "Made In" },
                    { key: "promotionalGift", label: "Promotional Gift" },
                    { key: "statusProduct", label: "Status" },
                ]}
                imageKey="photo"
                onDelete={handleDelete}
                onCancel={handleCancel}
            />
        </>
    );
};

export default ProductDelete;
