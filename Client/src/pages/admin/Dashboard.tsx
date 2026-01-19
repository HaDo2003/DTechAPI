import React, { useEffect, useState } from "react";
import InfoBoxes from "../../components/admin/dashboard/InfoBoxes";
import MonthlyRecap from "../../components/admin/dashboard/MonthlyRecap";
import Visitor from "../../components/admin/dashboard/Visitor";
import LatestOrder from "../../components/admin/dashboard/LastestOrder";
import UserList from "../../components/admin/dashboard/UserList";
import ProductList from "../../components/admin/dashboard/ProductList";
import DirectChat from "../../components/admin/dashboard/DirectChat";
import type { OrderMonitor } from "../../types/Order";
import type { CustomerMonitor } from "../../types/Customer";
import type { ProductMonitor } from "../../types/Product";
import { adminService } from "../../services/AdminService";
import { useAuth } from "../../context/AuthContext";
import type { VisitorCountMonitor } from "../../types/Dashboard";

const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<OrderMonitor[]>([]);
  const [customers, setCustomers] = useState<CustomerMonitor[]>([]);
  const [products, setProducts] = useState<ProductMonitor[]>([]);
  const [visitorCounts, setVisitorCounts] = useState<VisitorCountMonitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await adminService.fecthDashboardData(token ?? "");
        if (response.success && response.data) {
          setOrders(response.data.latestOrders);
          setCustomers(response.data.usersList);
          setProducts(response.data.productsList);
          setVisitorCounts(response.data.visitorCounts);
        } else {
          console.error(response.message);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  return (
    <>
      {loading ? (
        <div> Loading...</div >
      ) : (
        <div className="app-wrapper">
          {/* Main */}
          <main className="app-main">
            {/* Content Header */}
            <div className="app-content-header">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-6">
                    <h3 className="mb-0">Dashboard</h3>
                  </div>
                  <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-end">
                      <li className="breadcrumb-item">
                        <a href="#">Home</a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Dashboard
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* App Content */}
            <div className="app-content">
              <div className="container-fluid">
                {/* Info boxes & recap */}
                <InfoBoxes />
                <MonthlyRecap />

                {/* Row: Visitor + Latest Orders */}
                <div className="row mb-4">
                  <div className="col-lg-6">
                    <Visitor visitorCounts={visitorCounts} />
                  </div>
                  <div className="col-lg-6">
                    <LatestOrder orders={orders} />
                  </div>
                </div>

                {/* Row: Chat + Users + Products */}
                <div className="row">
                  <div className="col-md-8">
                    <div className="row g-4 mb-4">
                      <DirectChat messages={[]} contacts={[]} />
                      <UserList customers={customers} />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <ProductList products={products} />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default Dashboard;
