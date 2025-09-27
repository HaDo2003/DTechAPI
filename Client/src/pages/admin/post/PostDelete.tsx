import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { adminService } from "../../../services/AdminService";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";
import DeletePage from "../DeletePage";
import type { PostForm } from "../../../types/Post";

const PostDelete: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [data, setData] = useState<PostForm | null>(null);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            (async () => {
                const res = await adminService.getSingleData<PostForm>(`/api/post/get/${id}`, token ?? "");
                if (res.success && res.data) {
                    setData(res.data as PostForm);
                }
            })();
        }
    }, [id, token]);

    const handleDelete = async () => {
        setLoading(true);
        const res = await adminService.deleteData(`/api/post/delete`, id ?? "", token ?? "");
        if (res.success) {
            setLoading(false);
            navigate("/admin/post", {
                state: {
                    alert: {
                        message: "Post deleted successfully!",
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
        navigate("/admin/post");
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
            <DeletePage<PostForm>
                entityName="Post"
                data={data}
                fields={[
                    { key: "name", label: "Name" },
                    { key: "description", label: "Description" },
                    { key: "postDate", label: "Post Date" },
                    { key: "postedBy", label: "Posted By" },
                ]}
                imageKey="image"
                onDelete={handleDelete}
                onCancel={handleCancel}
            />
        </>
    );
};

export default PostDelete;
