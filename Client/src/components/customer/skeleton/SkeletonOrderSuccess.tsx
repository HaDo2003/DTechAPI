import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const OrderSuccessSkeleton = () => {
  return (
    <div className="bg-light min-vh-100">
      <div className="container">

        {/* Success Message */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <Skeleton height={28} width={260} className="mb-2" />
            <Skeleton height={16} width={320} />
            <Skeleton height={16} width={220} />
          </div>
        </div>

        <div className="row">

          {/* Purchase Info */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <Skeleton height={20} width={180} />
              </div>
              <div className="card-body">
                <Skeleton height={16} width="70%" className="mb-2" />
                <Skeleton height={16} width="60%" className="mb-2" />
                <Skeleton height={16} width="50%" />
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <Skeleton height={20} width={180} />
              </div>
              <div className="card-body">
                <Skeleton height={16} width="80%" className="mb-2" />
                <Skeleton height={16} width="50%" />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white">
                <Skeleton height={20} width={150} />
              </div>

              <div
                className="card-body overflow-auto"
                style={{ maxHeight: "150px" }}
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-center mb-3 pb-3 border-bottom"
                  >
                    <Skeleton width={150} height={100} className="me-3" />

                    <div className="flex-grow-1">
                      <Skeleton width="70%" />
                      <Skeleton width="40%" />
                    </div>

                    <Skeleton width={60} />
                  </div>
                ))}
              </div>

              <div className="card-footer bg-white">
                <Skeleton width="60%" height={16} className="mb-2" />
                <Skeleton width="50%" height={16} className="mb-2" />
                <Skeleton width="70%" height={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mb-5">
          <Skeleton height={48} width={220} className="me-3" inline />
          <Skeleton height={48} width={180} inline />
        </div>

      </div>
    </div>
  );
};

export default OrderSuccessSkeleton;
