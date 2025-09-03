import React, { useState, useEffect, type ChangeEvent } from "react";
import { type Customer, type CustomerProfileForm } from "../../../types/Customer";
import Input from "../Input";

type ProfileProps = {
    customer: Customer | null;
};

const Profile: React.FC<ProfileProps> = ({ customer }) => {
    const [form, setForm] = useState<CustomerProfileForm>({
        userName: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        dateOfBirth: "",
        image: "",
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


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, files } = e.target;
        if (type === "file" && files) {
            setForm((prev) => ({ ...prev, imageUpload: files[0] }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = () => {
        console.log("Saving profile:", form);
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <h4>Customer Information</h4>
            <div className="row">
                {/* Left side */}
                <div className="col-9">
                    {/* UserName */}
                    <div className="row m-2">
                        <div className="col-3 align-content-center">
                            <label>User Name</label>
                        </div>
                        <div className="col-9">
                            <input
                                name="userName"
                                className="form-control"
                                value={form.userName}
                                readOnly
                            />
                        </div>
                    </div>

                    {/* FullName */}
                    <div className="row m-2">
                        <div className="col-3 align-content-center">
                            <label>Full Name</label>
                        </div>
                        <div className="col-9">
                            <input
                                name="fullName"
                                className="form-control"
                                value={form.fullName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="row m-2">
                        <div className="col-3 align-content-center">
                            <label>Email</label>
                        </div>
                        <div className="col-9">
                            <input
                                name="email"
                                className="form-control"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="row m-2">
                        <div className="col-3 align-content-center">
                            <label>Phone Number</label>
                        </div>
                        <div className="col-9">
                            <input
                                name="phoneNumber"
                                className="form-control"
                                value={form.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="row m-2">
                        <div className="col-3 align-content-center">
                            <label>Gender</label>
                        </div>
                        <div className="col-9 d-flex gap-3">
                            {["Male", "Female", "Other"].map((g) => (
                                <div key={g}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={g}
                                        checked={form.gender === g}
                                        onChange={handleChange}
                                    />
                                    <label className="ms-1">{g}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="row m-2">
                        <div className="col-3 align-content-center">
                            <label>Date of Birth</label>
                        </div>
                        <div className="col-9">
                            <input
                                type="date"
                                name="dateOfBirth"
                                className="form-control"
                                value={form.dateOfBirth ?? ""}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Right side (Image upload) */}
                <div className="col-3">
                    <div className="d-flex flex-column align-items-center">
                        <img
                            src={form.image || "/default-profile.png"}
                            alt="Profile"
                            style={{ maxWidth: "100%" }}
                        />
                        <label htmlFor="input-file" className="btn btn-link my-2">
                            Update Photo
                        </label>
                        <input
                            type="file"
                            id="input-file"
                            name="imageUpload"
                            className="d-none"
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
    );
}

export default Profile;