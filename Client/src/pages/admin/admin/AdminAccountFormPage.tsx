import React, { useState, useEffect } from "react";
import { type AdminForm } from "../../../types/Admin";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { adminService } from "../../../services/AdminService";
import { useAuth } from "../../../context/AuthContext";
import CardWrapped from "../CardWrapped";
import InputField from "../InputField";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";


const AdminAccountFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  const mode: "create" | "edit" = location.pathname.includes("edit") ? "edit" : "create";

  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);
  const [form, setForm] = useState<AdminForm>({
    id: "",
    fullName: "",
    userName: "",
    email: "",
    phoneNumber: "",
    gender: "Male",
    dateOfBirth: "",
    roleId: "",
    image: "",
    createdBy: "",
    createDate: "",
    updatedBy: "",
    updateDate: "",
  });

  const [preview, setPreview] = useState<string>("");
  const options = ["Male", "Female", "Other"];
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch roles
  useEffect(() => {
    (async () => {
      const res = await adminService.getRolesData<{ id: string; name: string }>("/api/admin/get-roles", token ?? "");
      if (res.success && res.data) {
        setRoles(res.data.map(r => ({ value: r.id, label: r.name })));
      }
    })();
  }, [token]);

  // Fetch admin data if edit
  useEffect(() => {
    if (mode === "edit" && id) {
      (async () => {
        const res = await adminService.getSingleData<AdminForm>(`/api/admin/get/${id}`, token ?? "");
        if (res.success && res.data) {
          setForm(res.data as unknown as AdminForm);
          setPreview((res.data as any).image ?? "");
        }
      })();
    }
  }, [id, mode, token]);

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setForm({ ...form, imageUpload: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fullName', form.fullName ?? "");
    formData.append('userName', form.userName ?? "");
    formData.append('email', form.email ?? "");
    formData.append('phoneNumber', form.phoneNumber ?? "");
    formData.append('gender', form.gender ?? "");
    formData.append('dateOfBirth', form.dateOfBirth ?? "");
    formData.append('roleId', form.roleId ?? "");
    formData.append('image', form.image ?? "");

    // Only append image if it exists
    if (form.imageUpload) {
      formData.append('imageUpload', form.imageUpload);
    }
    console.log("Submitting form data:", Object.fromEntries(formData.entries()));

    setLoading(true);
    const res = mode === "create"
      ? await adminService.createData("/api/admin/create", formData, token ?? "")
      : await adminService.updateData("/api/admin/update", id ?? "", formData, token ?? "");

    if (res.success && mode === "create") {
      setLoading(false);
      navigate("/admin/admin", {
        state: {
          alert: {
            message: mode === "create" ? "Admin created successfully!" : "Admin updated successfully!",
            type: "success",
          },
        },
      });
    } else if (res.success && mode === "edit") {
      const updatedRes = await adminService.getSingleData<AdminForm>(`/api/admin/get/${id}`, token ?? "");
      if (updatedRes.success && updatedRes.data) {
        setForm(updatedRes.data as unknown as AdminForm);
        setPreview((updatedRes.data as any).image ?? "");
        setAlert({ message: "Admin updated successfully!", type: "success" });
      }
      setLoading(false);
    } else {
      setLoading(false);
      setAlert({ message: res.message || "Submit form failed!", type: "error" });
    }
  };

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
      <CardWrapped title="Admin Account Form">
        <>
          <form onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-header text-center">
                <h3>{mode === "create" ? "Create Admin" : "Edit Admin"}</h3>
              </div>
              <div className="card-body">
                {/* Avatar upload */}
                <div className="form-group">
                  <div className="row align-items-center">
                    <div className="col-lg-2 col-sm-4 text-center">
                      {preview && <img src={preview} alt="Preview" className="py-2" width={100} />}
                    </div>
                    <div className="col-lg-10 col-sm-8 p-0">
                      <label htmlFor="input-file" className="btn btn-sm btn-danger ms-2">
                        Update Photo
                      </label>
                    </div>
                  </div>
                  <input
                    type="file"
                    name="imageUpload"
                    id="input-file"
                    className="form-control d-none"
                    onChange={handleFileChange}
                  />
                </div>

                {/* User Name + Role */}
                <div className="row">
                  <div className="col">
                    <InputField
                      label="User Name"
                      name="userName"
                      value={form.userName ?? ""}
                      onChange={handleChange}
                      readOnly={mode === "edit"}
                    />
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="role-select">Role</label>
                      <select
                        id="role-select"
                        name="roleId"
                        value={form.roleId}
                        onChange={handleChange}
                        className="form-control"
                      >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Fullname + Date of Birth */}
                <div className="row">
                  <div className="col">
                    <InputField
                      label="Full Name"
                      name="fullName"
                      value={form.fullName ?? ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col">
                    <InputField
                      label="Date of Birth"
                      type="date"
                      name="dateOfBirth"
                      value={form.dateOfBirth ?? ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="form-group py-2 custom-radio-container">
                  <label className="control-label">Gender</label>
                  <div className="custom-radio-group">
                    {options.map((option) => (
                      <div key={option}>
                        <input
                          type="radio"
                          name="gender"
                          value={option}
                          id={option}
                          className="custom-radio"
                          checked={form.gender === option}
                          onChange={handleChange}
                        />
                        <label className="custom-label-radio" htmlFor={option}>
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phone + Email */}
                <div className="row">
                  <div className="col">
                    <InputField
                      label="Phone Number"
                      name="phoneNumber"
                      value={form.phoneNumber ?? ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col">
                    <InputField
                      label="Email"
                      name="email"
                      value={form.email ?? ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Audit fields in edit mode */}
                {mode === "edit" && (
                  <>
                    <div className="row">
                      <div className="col">
                        <InputField
                          label="Created By"
                          name="createdBy"
                          value={form.createdBy ?? ""}
                          readOnly
                        />
                      </div>
                      <div className="col">
                        <InputField
                          label="Create Date"
                          name="createDate"
                          value={form.createDate ?? ""}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col">
                        <InputField
                          label="Updated By"
                          name="updatedBy"
                          value={form.updatedBy ?? ""}
                          readOnly
                        />
                      </div>
                      <div className="col">
                        <InputField
                          label="Update Date"
                          name="updateDate"
                          value={form.updateDate ?? ""}
                          readOnly
                        />
                      </div>
                    </div>
                  </>
                )}

              </div>
              <div className="card-footer">
                <button type="submit" className="btn btn-primary me-2">
                  <i className="fa-solid fa-floppy-disk"></i> Save
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin/admin")}
                  className="btn btn-secondary"
                >
                  <i className="fa-solid fa-right-from-bracket fa-rotate-180"></i> Back to List
                </button>
              </div>
            </div>
          </form>
        </>
      </CardWrapped>
    </>
  );
};

export default AdminAccountFormPage;
