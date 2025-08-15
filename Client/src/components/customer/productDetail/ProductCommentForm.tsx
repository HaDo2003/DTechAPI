import React, { useState } from "react";

interface ProductCommentFormProps {
  productId: number;
  onSubmit: (formData: CommentFormData) => void;
}

export interface CommentFormData {
  productId: number;
  rate: number;
  name: string;
  email: string;
  detail: string;
}

const ProductCommentForm: React.FC<ProductCommentFormProps> = ({
  productId,
  onSubmit
}) => {
  const [rate, setRate] = useState<number>(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [detail, setDetail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ productId, rate, name, email, detail });
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
                    checked={rate === i}
                    onChange={() => setRate(i)}
                  />
                  <label htmlFor={`rating-${i}`} className="fa fa-star"></label>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="row m-2">
        <div className="form-group">
          <input
            className="form-control"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Email */}
      <div className="row m-2">
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Comment */}
      <div className="row m-2">
        <div className="form-group">
          <textarea
            className="form-control"
            placeholder="Your Comment"
            rows={3}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
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
