import React from "react";
import { Link } from "react-router-dom";

interface Product {
  productId: number;
  name: string;
  photo: string;
  price: number;
  category: {
    name: string;
  };
}

interface RecentlyAddedProductsProps {
  products: Product[];
}

const ProductList: React.FC<RecentlyAddedProductsProps> = ({ products }) => {
  return (
    <div className="card">
      {/* Card Header */}
      <div className="card-header">
        <h3 className="card-title">Recently Added Products</h3>

        <div className="card-tools">
          <button type="button" className="btn btn-tool">
            <i className="bi bi-dash-lg"></i>
          </button>
          <button type="button" className="btn btn-tool">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body p-0">
        <div className="px-2">
          {products.map((product) => (
            <div className="d-flex border-top py-2 px-1" key={product.productId}>
              <div className="col-2">
                <img
                  src={product.photo}
                  alt={product.name}
                  className="img-size-50"
                />
              </div>
              <div className="col-10">
                <Link
                  to={`/admin/products/edit/${product.productId}`}
                  className="fw-bold"
                >
                  {product.category?.name}
                  <span className="badge text-bg-info float-end">
                    ${product.price.toLocaleString()}
                  </span>
                </Link>
                <div className="text-truncate">
                  {product.name.length > 30
                    ? product.name.substring(0, 30) + "..."
                    : product.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card Footer */}
      <div className="card-footer text-center">
        <Link to="/admin/products" className="uppercase">
          View All Products
        </Link>
      </div>
    </div>
  );
};

export default ProductList;
