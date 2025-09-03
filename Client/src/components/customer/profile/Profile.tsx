import React, { useState, useEffect, type ChangeEvent } from "react";
import { type Customer, type CustomerProfileForm } from "../../../types/Customer";
import InputWithLabel from "./InputWithLabel";
import { customerService } from "../../../services/CustomerService";
import { useAuth } from "../../../context/AuthContext";
import AlertForm from "../AlertForm";
import Loading from "../../shared/Loading";

type ProfileProps = {
    customer: Customer | null;
};

const Profile: React.FC<ProfileProps> = ({ customer }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [form, setForm] = useState<CustomerProfileForm>({
        userName: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        dateOfBirth: "",
        image: "",
        imageUpload: undefined
    });

    useEffect(() => {
        if (customer) {
            const {
                userName = "",
                fullName = "",
                email = "",
                phoneNumber = "",
                gender = "",
                dateOfBirth = "",
                image = "",
            } = customer;
            setForm({ userName, fullName, email, phoneNumber, gender, dateOfBirth, image });
        } else {
            setForm({
                userName: "",
                fullName: "",
                email: "",
                phoneNumber: "",
                gender: "",
                dateOfBirth: "",
                image: "",
            });
        }
    }, [customer]);

    useEffect(() => {
        return () => {
            if (form.image && form.image.startsWith("blob:")) {
                URL.revokeObjectURL(form.image);
            }
        };
    }, [form.image]);


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, files } = e.target;
        if (type === "file" && files && files[0]) {
            const file = files[0];
            const previewUrl = URL.createObjectURL(file);

            setForm((prev) => ({
                ...prev,
                image: previewUrl,
                imageUpload: file
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await customerService.updateCustomerProfile(token ?? "", form);
            if (res.success) {
                setAlert({ message: res.message || "Profile updated successfully!", type: "success" });
                setLoading(false);
            } else {
                setAlert({ message: res.message || "Fail to update profile!", type: "error" });
                setLoading(false);
            }
        } catch (err) {
            setAlert({ message: "Registration failed, please try again.", type: "error" });
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                <Loading />;
            </div>
        );
    }

    return (
        <>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <h4>Customer Information</h4>
                <hr />
                <div className="row">
                    {/* Left side */}
                    <div className="col-9">
                        <InputWithLabel
                            label="User Name"
                            name="userName"
                            type="text"
                            value={form.userName}
                            required
                            readonly
                        />

                        <InputWithLabel
                            label="Full Name"
                            name="fullName"
                            type="text"
                            value={form.fullName}
                            required
                            onChange={handleChange}
                        />

                        <InputWithLabel
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            required
                            onChange={handleChange}
                        />

                        <InputWithLabel
                            label="Phone Number"
                            name="phoneNumber"
                            type="tel"
                            value={form.phoneNumber}
                            required
                            onChange={handleChange}
                        />

                        <InputWithLabel
                            label="Gender"
                            name="gender"
                            value={form.gender}
                            required
                            onChange={handleChange}
                        />

                        <InputWithLabel
                            label="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                            value={form.dateOfBirth}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Right side (Image upload) */}
                    <div className="col-3">
                        <div className="d-flex flex-column align-items-center">
                            <img
                                src={form.image || "/default-profile.png"}
                                alt="Profile"
                                style={{ maxWidth: "100%" }}
                                className="w-32 h-32 rounded-full object-cover border shadow"
                            />
                            <label htmlFor="input-file" className="custom-upload text-center my-2">
                                Update Photo
                            </label>
                            <input
                                type="file"
                                id="input-file"
                                name="imageUpload"
                                className="form-control custom-photo-input d-none"
                                accept="image/*"
                                onChange={handleChange}
                            />
                            <input type="hidden" name="Image" value={form.image ?? ""} />
                        </div>
                    </div>
                </div>

                <div className="ps-3">
                    <button type="submit" className="btn btn-primary">
                        <i className="fa-solid fa-floppy-disk fa-sm"></i> Save
                    </button>
                </div>
            </form>

            {alert && (
                <AlertForm
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
        </>

    );
}

export default Profile;