import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { adminService } from "../../../services/AdminService";
import CardWrapped from "../CardWrapped";
import InputField from "../InputField";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";
import type { BrandForm } from "../../../types/Brand";

const BrandFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  const mode: "create" | "edit" = location.pathname.includes("edit") ? "edit" : "create";

  const [form, setForm] = useState<BrandForm>({
    id: 0,
    name: "",
    slug: "",
    status: 1,
    statusName: "",
    logo: "",
  });

  const [preview, setPreview] = useState<string>("");
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch brand when editing
  useEffect(() => {
    if (mode === "edit" && id) {
      (async () => {
        const res = await adminService.getSingleData<BrandForm>(`/api/brand/get/${id}`, token ?? "");
        if (res.success && res.data) {
          const brand = res.data as BrandForm;
          setForm({
            ...brand,
            statusName: brand.status === 1 ? "Active" : "Inactive",
          });
          setPreview(brand.logo ?? "");
        }
      })();
    }
  }, [id, mode, token]);

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "status" ? Number(value) : value,
    });
  };

  // handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setForm({ ...form, logoUpload: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Name", form.name ?? "");
    formData.append("Status", form.status?.toString() ?? "");
    formData.append("Logo", form.logo ?? "");

    if (form.logoUpload) {
      formData.append("logoUpload", form.logoUpload);
    }

    setLoading(true);
    const res =
      mode === "create"
        ? await adminService.createData("/api/brand/create", formData, token ?? "")
        : await adminService.updateData("/api/brand/update", id ?? "", formData, token ?? "");

    if (res.success && mode === "create") {
      setLoading(false);
      navigate("/admin/brand", {
        state: {
          alert: {
            message: "Brand created successfully!",
            type: "success",
          },
        },
      });
    } else if (res.success && mode === "edit") {
      const updatedRes = await adminService.getSingleData<BrandForm>(`/api/brand/get/${id}`, token ?? "");
      if (updatedRes.success && updatedRes.data) {
        const updated = updatedRes.data as BrandForm;
        setForm({
          ...updated,
          statusName: updated.status === 1 ? "Active" : "Inactive",
        });
        setPreview(updated.logo ?? "");
        setAlert({ message: "Brand updated successfully!", type: "success" });
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

      <CardWrapped title="Brand Form">
        <>
          <form onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-header text-center">
                <h3>{mode === "create" ? "Create Brand" : "Edit Brand"}</h3>
              </div>
              <div className="card-body">
                {/* Logo upload */}
                <div className="form-group">
                  <div className="row align-items-center">
                    <div className="col-lg-2 col-sm-4 text-center">
                      {preview && <img src={preview} alt="Preview" className="py-2" width={100} />}
                    </div>
                    <div className="col-lg-10 col-sm-8 p-0">
                      <label htmlFor="input-file" className="btn btn-sm btn-danger ms-2">
                        Update Logo
                      </label>
                    </div>
                  </div>
                  <input
                    type="file"
                    name="logoUpload"
                    id="input-file"
                    className="form-control d-none"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="row">
                  <div className="col">
                    <InputField
                      label="Name"
                      name="name"
                      value={form.name ?? ""}
                      onChange={handleChange}
                    />
                  </div>

                  {mode === "edit" && (
                    <div className="col">
                      <InputField
                        label="Slug"
                        name="slug"
                        value={form.slug ?? ""}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>
                  )}

                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="status-select">Status</label>
                      <select
                        id="status-select"
                        name="status"
                        value={form.status ?? ""}
                        onChange={handleChange}
                        className="form-control"
                      >
                        <option value="">Select Status</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

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
                  onClick={() => navigate("/admin/brand")}
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

export default BrandFormPage;
