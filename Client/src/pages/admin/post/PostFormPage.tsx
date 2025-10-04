import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { adminService } from "../../../services/AdminService";
import { useAuth } from "../../../context/AuthContext";
import CardWrapped from "../CardWrapped";
import InputField from "../InputField";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";
import { type PostForm } from "../../../types/Post";
import RichTextEditor from "../../../components/admin/TextEditor";
import DOMPurify from "../../../utils/santitizeConfig";

const PostFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useAuth();

    const mode: "create" | "edit" = location.pathname.includes("edit") ? "edit" : "create";

    const [form, setForm] = useState<PostForm>({
        id: 0,
        name: "",
        description: "",
        image: "",
        status: "Available",
        postCategoryId: 0,
        postCategory: ""
    });

    const [preview, setPreview] = useState<string>("");
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [loading, setLoading] = useState(false);
    const [categories, setCategory] = useState<{ value: number; label: string }[]>([]);

    useEffect(() => {
        (async () => {
            const res = await adminService.getCategoriesData<{ id: number; name: string }>("/api/post/get-categories", token ?? "");
            if (res.success && res.data) {
                setCategory(res.data.map(r => ({ value: r.id, label: r.name })));
            }
        })();
    }, [token]);

    useEffect(() => {
        if (mode === "edit" && id) {
            (async () => {
                setLoading(true);
                const res = await adminService.getSingleData<PostForm>(`/api/post/get/${id}`, token ?? "");
                if (res) {
                    const post = res as unknown as PostForm;
                    setForm(post);
                    setPreview((res as any).image ?? "");
                }
                setLoading(false);
            })();
        }
    }, [id, mode, token]);

    // handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: name === "postCategoryId" ? (value ? Number(value) : null) : value,
        });
    };

    // handle file input
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setForm({ ...form, imageUpload: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("Name", form.name ?? "");
        formData.append("Description", form.description ?? "");
        formData.append("Image", form.image ?? "");

        if (form.postCategoryId) {
            formData.append("PostCategoryId", String(form.postCategoryId));
        }

        if (form.imageUpload) {
            formData.append("ImageUpload", form.imageUpload);
        }

        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        setLoading(true);
        const res = mode === "create"
            ? await adminService.createData("/api/post/create", formData, token ?? "")
            : await adminService.updateData("/api/post/update", id ?? "", formData, token ?? "");

        if (res.success && mode === "create") {
            setLoading(false);
            navigate("/admin/post", {
                state: {
                    alert: {
                        message: mode === "create" ? "Post created successfully!" : "Post updated successfully!",
                        type: "success",
                    },
                },
            });
        } else if (res.success && mode === "edit") {
            const updatedRes = await adminService.getSingleData<PostForm>(`/api/post/get/${id}`, token ?? "");
            if (updatedRes) {
                setForm(updatedRes as unknown as PostForm);
                setPreview((updatedRes as any).image ?? "");
                setAlert({ message: "Post updated successfully!", type: "success" });
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
            <CardWrapped title="Post Form">
                <form onSubmit={handleSubmit}>
                    <div className="card">
                        <div className="card-header text-center">
                            <h3>{mode === "create" ? "Create Post" : "Edit Post"}</h3>
                        </div>
                        <div className="card-body">
                            {/* Image upload */}
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

                            <div className="row">
                                <div className="col">
                                    <InputField
                                        label="Title"
                                        name="name"
                                        value={form.name ?? ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="category-select">Post Category</label>
                                        <select
                                            id="category-select"
                                            name="postCategoryId"
                                            value={form.postCategoryId ?? 0}
                                            onChange={handleChange}
                                            className="form-control"
                                        >
                                            <option value="">Select Post Category</option>
                                            {categories.map((category) => (
                                                <option key={category.value} value={category.value}>
                                                    {category.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
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
                                            <option value="Available">Available</option>
                                            <option value="Unavailable">Unavailable</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <RichTextEditor
                                            value={form.description ?? ""}
                                            onChange={(data) => {
                                                const cleanData = DOMPurify.sanitize(data);
                                                setForm((prevForm) => ({
                                                    ...prevForm,
                                                    description: cleanData,
                                                }));
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {mode === "edit" && (
                                <>
                                    <div className="row">
                                        <div className="col">
                                            <InputField
                                                label="Posted By"
                                                name="postBy"
                                                value={form.postBy ?? ""}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col">
                                            <InputField
                                                label="Post Date"
                                                name="postDate"
                                                value={form.postDate ?? ""}
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
                                onClick={() => navigate("/admin/post")}
                                className="btn btn-secondary"
                            >
                                <i className="fa-solid fa-right-from-bracket fa-rotate-180"></i> Back to List
                            </button>
                        </div>
                    </div>
                </form>
            </CardWrapped>
        </>
    );
};

export default PostFormPage;
