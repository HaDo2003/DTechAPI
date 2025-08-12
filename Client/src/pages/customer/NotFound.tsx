import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  useEffect(() => {
    document.title = "DTech - Not Found";
  }, []);
  return (
    <div className="container text-center mt-5">
      <h1 className="display-1 text-danger">404</h1>
      <h2 className="mb-3">Oops! Page not found.</h2>
      <p className="text-muted mb-4">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;