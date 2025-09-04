import React, { useState } from "react";
import type { ProductCommentRequest } from "../../../types/ProductComment";
import Input from "../Input";

interface ProductCommentFormProps {
  productId: number;
  name?: string;
  email?: string;
  onSubmit: (formData: ProductCommentRequest) => void;
}

const ProductCommentForm: React.FC<ProductCommentFormProps> = ({
  productId,
  name,
  email,
  onSubmit
}) => {
  const [formData, setFormData] = useState<ProductCommentRequest>({
    productId: productId,
    name: name ?? "",
    email: email ?? "",
    detail: "",
    rate: 5,
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <input type="hidden" value={productId} />

      {/* Rating */}
      <div className="row m-2">
        <div className="col-md-1">
          <label className="col-form-label text-center align-content-center rate-size">
            Rate
          </label>
        </div>
        <div className="col-md-11 align-content-center">
          <div className="form-group rating-star">
            <div className="star-icon">
              {[1, 2, 3, 4, 5].map((i) => (
                <React.Fragment key={i}>
                  <input
                    type="radio"
                    id={`rating-${i}`}
                    name="rate"
                    value={i}
                    checked={formData.rate === i}
                    onChange={(e) =>
                      setFormData({ ...formData, rate: parseInt(e.target.value, 10) })
                    }
                  />
                  <label htmlFor={`rating-${i}`} className="fa fa-star"></label>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Name */}
      <Input
        type="text"
        placeholder="Name"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />

      {/* Email */}
      <Input
        type="email"
        placeholder="Email"
        required
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />

      {/* Comment */}
      <div className="row m-2">
        <div className="form-group">
          <textarea
            className="form-control"
            placeholder="Your Comment"
            rows={3}
            value={formData.detail}
            onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
            required
          ></textarea>
        </div>
      </div>

      {/* Submit */}
      <div className="row m-2 text-center align-content-center">
        <div className="form-group">
          <button
            type="submit"
            className="btn btn-primary w-100 button-hover"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductCommentForm;
