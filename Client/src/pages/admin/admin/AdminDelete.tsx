import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { adminService } from "../../../services/AdminService";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";
import DeletePage from "../DeletePage";
import { type AdminForm } from "../../../types/Admin";

const AdminDelete: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [data, setData] = useState<AdminForm | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      (async () => {
        const res = await adminService.getSingleData<AdminForm>(`/api/admin/get/${id}`, token ?? "");
        if (res.success && res.data) {
          setData(res.data as unknown as AdminForm);
        }
      })();
    }
  }, [id, token]);

  const handleDelete = async () => {
    setLoading(true);
    const res = await adminService.deleteData(`/api/admin/delete`, id ?? "", token ?? "");
    if (res.success) {
      setLoading(false);
      navigate("/admin/admin", {
        state: {
          alert: {
            message: "Admin deleted successfully!",
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
    navigate("/admin/admin");
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
      <DeletePage<AdminForm>
        entityName="Admin Account"
        data={data}
        fields={[
          { key: "email", label: "Email" },
          { key: "userName", label: "User Name" },
          { key: "gender", label: "Gender" },
          { key: "phoneNumber", label: "Phone Number" },
          { key: "dateOfBirth", label: "Date of Birth" },
          { key: "roleId", label: "Role" },
          { key: "createdBy", label: "Created By" },
          { key: "createDate", label: "Create Date" },
          { key: "updatedBy", label: "Updated By" },
          { key: "updateDate", label: "Update Date" },
        ]}
        imageKey="image"
        onDelete={handleDelete}
        onCancel={handleCancel}
      />
    </>
  );
};

export default AdminDelete;
