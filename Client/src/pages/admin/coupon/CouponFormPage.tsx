import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { adminService } from "../../../services/AdminService";
import { useAuth } from "../../../context/AuthContext";
import CardWrapped from "../CardWrapped";
import InputField from "../InputField";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";
import { type CouponForm } from "../../../types/Coupon";

const CouponFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  const mode: "create" | "edit" = location.pathname.includes("edit") ? "edit" : "create";

  const [form, setForm] = useState<CouponForm>({
    id: 0,
    code: "",
    discountType: "Percentage",
    discount: 0,
    maxDiscount: 0,
    condition: 0,
    details: "",
    endDate: "",
    status: 1,
    statusName: "",
  });

  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && id) {
      (async () => {
        const res = await adminService.getSingleData<CouponForm>(`/api/coupon/get/${id}`, token ?? "");
        if (res.success && res.data) {
          setForm(res.data as unknown as CouponForm);
        }
      })();
    }
  }, [id, mode, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "discount" || name === "maxDiscount" || name === "condition" || name === "status" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const res =
      mode === "create"
        ? await adminService.createData("/api/coupon/create", form, token ?? "")
        : await adminService.updateData("/api/coupon/update", id ?? "", form, token ?? "");

    if (res.success && mode === "create") {
      setLoading(false);
      navigate("/admin/coupon", {
        state: {
          alert: {
            message: "Coupon created successfully!",
            type: "success",
          },
        },
      });
    } else if (res.success && mode === "edit") {
      const updatedRes = await adminService.getSingleData<CouponForm>(`/api/coupon/get/${id}`, token ?? "");
      if (updatedRes.success && updatedRes.data) {
        setForm(updatedRes.data as unknown as CouponForm);
        setAlert({ message: "Coupon updated successfully!", type: "success" });
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
      <CardWrapped title="Coupon Form">
        <>
          <form onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-header text-center">
                <h3>{mode === "create" ? "Create Coupon" : "Edit Coupon"}</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <InputField
                      label="Code"
                      name="code"
                      value={form.code ?? ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="discountType">Discount Type</label>
                      <select
                        id="discountType"
                        name="discountType"
                        value={form.discountType}
                        onChange={handleChange}
                        className="form-control"
                        title="Discount Type"
                      >
                        <option value="Percentage">Percentage</option>
                        <option value="Direct">Direct</option>
                      </select>
                    </div>
                  </div>
                  <div className="col">
                    <InputField
                      label="Discount"
                      name="discount"
                      value={form.discount.toString()}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <InputField
                      label="Max Discount"
                      name="maxDiscount"
                      value={form.maxDiscount?.toString() ?? ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col">
                    <InputField
                      label="Condition"
                      name="condition"
                      value={form.condition?.toString() ?? ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col">
                    <InputField
                      label="End Date"
                      name="endDate"
                      value={form.endDate ?? ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <InputField
                      label="Details"
                      name="details"
                      value={form.details ?? ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="status-select">Status</label>
                      <select
                        id="status-select"
                        name="status"
                        value={form.status ?? ""}
                        onChange={handleChange}
                        className="form-control"
                        title="Status"
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
                  onClick={() => navigate("/admin/coupon")}
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

export default CouponFormPage;
