import React, { useState } from "react";
import AlertForm from "../../components/customer/AlertForm";
import { useAuth } from "../../context/AuthContext";
import { customerService } from "../../services/CustomerService";
import type { Contact } from "../../types/Contact";

const ContactPage: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Contact>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phoneNumber: "",
    detail: "",
  });
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phoneNumber || !formData.detail) {
      setAlert({ message: "Please fill out all fields", type: "error" });
      return;
    }

    try {
      const res = await customerService.sendContact(formData);
      if (res.success) {
        setAlert({ message: "Send Contact Successful!", type: "success" });
        setFormData({ name: "", email: "", phoneNumber: "", detail: "" });
      } else {
        setAlert({ message: res.message || "Send contact fail", type: "success" });
      }
    } catch {
      setAlert({ message: "Send Contact Fail!", type: "success" });
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          {/* Contact Form */}
          <div className="col-md-6 mx-auto">
            <h1 className="mb-4">Contact Us</h1>
            <p className="mb-4">
              If you have any questions, feedback, or need further information,
              please fill out the form below:
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="tel"
                  name="phoneNumber"
                  className="form-control"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <textarea
                  name="detail"
                  className="form-control"
                  placeholder="Message"
                  rows={4}
                  value={formData.detail}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-dark w-100">
                Send
              </button>
            </form>
          </div>

          {/* Google Maps */}
          <div className="col-md-6">
            <div className="map-container" style={{ height: "100%", minHeight: "400px" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.13165092376!2d106.79674867597399!3d10.877590029698258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a415a9d221%3A0x550c2b41569376f9!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBRdeG7kWMgVOG6vyAtIMSQ4bqhaSBo4buNYyBRdeG7kWMgZ2lhIFRQLkhDTQ!5e0!3m2!1svi!2sus!4v1750602756426!5m2!1svi!2sus"
                style={{ border: 0, width: "100%", height: "100%" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      {alert && (
        <AlertForm
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </>
  );
};

export default ContactPage;
