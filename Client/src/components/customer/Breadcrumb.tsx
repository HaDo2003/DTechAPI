import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const rawSegments = location.pathname.split("/").filter(Boolean);

  const isHome = rawSegments.length === 0;

  const formatSegment = (segment: string): string => {
    let displaySegment = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    switch (displaySegment) {
      case "ForgotPassword":
        return "Forgot Password";
      case "ResetPassword":
        return "Reset Password";
      default:
        return displaySegment;
    }
  };

  const breadcrumbItems = rawSegments.map((segment, index) => {
    if (segment.toLowerCase() === "authentication") return null;

    const path = "/" + rawSegments.slice(0, index + 1).join("/");
    const isLast = index === rawSegments.length - 1;

    return isLast ? (
      <li key={path} className="breadcrumb-item breadcrumb-active" aria-current="page">
        {formatSegment(segment)}
      </li>
    ) : (
      <li key={path} className="breadcrumb-item">
        <Link className="breadcrumb-link" to={path}>
          {formatSegment(segment)}
        </Link>
      </li>
    );
  });

  return (
    <div className="container my-1">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb pt-1 custom-breadcrumb">
          {!isHome && (
            <li className="breadcrumb-item ps-2">
              <Link to="/" className="breadcrumb-link">Home</Link>
            </li>
          )}
          {breadcrumbItems}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;