import React from "react";
import InfoBoxes from "../../components/admin/dashboard/InfoBoxes";
import MonthlyRecap from "../../components/admin/dashboard/MonthlyRecap";
import Visitor from "../../components/admin/dashboard/Visitor";
import LatestOrder from "../../components/admin/dashboard/LastestOrder";
import UserList from "../../components/admin/dashboard/UserList";
import ProductList from "../../components/admin/dashboard/ProductList";
import DirectChat from "../../components/admin/dashboard/DirectChat";

interface DashboardProps {
  orders?: any[];
  customers?: any[];
  countCustomer?: number;
  products?: any[];
}

const Dashboard: React.FC<DashboardProps> = ({
  orders = [],
  customers = [],
  products = [],
}) => {
  return (
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
            <div className="row">
              <div className="col-lg-6">
                <Visitor />
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
  );
};

export default Dashboard;
