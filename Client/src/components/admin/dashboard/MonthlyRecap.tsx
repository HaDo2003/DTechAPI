import React from "react";
import Chart from "react-apexcharts";

const MonthlyRecap: React.FC = () => {
    const options: ApexCharts.ApexOptions = {
        chart: {
            height: 180,
            type: "area",
            toolbar: { show: false },
        },
        legend: { show: false },
        colors: ["#0d6efd", "#20c997"],
        dataLabels: { enabled: false },
        stroke: { curve: "smooth" },
        xaxis: {
            type: "datetime",
            categories: [
                "2023-01-01",
                "2023-02-01",
                "2023-03-01",
                "2023-04-01",
                "2023-05-01",
                "2023-06-01",
                "2023-07-01",
            ],
        },
        tooltip: {
            x: { format: "MMMM yyyy" },
        },
    };

    const series = [
        {
            name: "Digital Goods",
            data: [28, 48, 40, 19, 86, 27, 90],
        },
        {
            name: "Electronics",
            data: [65, 59, 80, 81, 56, 55, 40],
        },
    ];
    return (
        <div className="row">
            <div className="col-md-12">
                <div className="card mb-4">
                    {/* Card Header */}
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">Monthly Recap Report</h5>

                        <div className="card-tools d-flex align-items-center gap-2">
                            <button
                                type="button"
                                className="btn btn-tool"
                                data-lte-toggle="card-collapse"
                            >
                                <i data-lte-icon="expand" className="bi bi-plus-lg"></i>
                                <i data-lte-icon="collapse" className="bi bi-dash-lg"></i>
                            </button>

                            <div className="btn-group">
                                <button
                                    type="button"
                                    className="btn btn-tool dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                >
                                    <i className="bi bi-wrench"></i>
                                </button>
                                <div className="dropdown-menu dropdown-menu-end">
                                    <a href="#" className="dropdown-item">
                                        Action
                                    </a>
                                    <a href="#" className="dropdown-item">
                                        Another action
                                    </a>
                                    <a href="#" className="dropdown-item">
                                        Something else here
                                    </a>
                                    <div className="dropdown-divider"></div>
                                    <a href="#" className="dropdown-item">
                                        Separated link
                                    </a>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="btn btn-tool"
                                data-lte-toggle="card-remove"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="card-body">
                        <div className="row">
                            {/* Sales Chart */}
                            <div className="col-md-8">
                                <p className="text-center">
                                    <strong>Sales: 1 Jan, 2023 - 30 Jul, 2023</strong>
                                </p>
                                <Chart
                                    options={options}
                                    series={series}
                                    type="area"
                                    height={180}
                                />
                            </div>

                            {/* Goal Completion */}
                            <div className="col-md-4">
                                <p className="text-center">
                                    <strong>Goal Completion</strong>
                                </p>

                                <div className="progress-group">
                                    Add Products to Cart
                                    <span className="float-end">
                                        <b>160</b>/200
                                    </span>
                                    <div className="progress progress-sm">
                                        <div
                                            className="progress-bar text-bg-primary"
                                            style={{ width: "80%" }}
                                        />
                                    </div>
                                </div>

                                <div className="progress-group">
                                    Complete Purchase
                                    <span className="float-end">
                                        <b>310</b>/400
                                    </span>
                                    <div className="progress progress-sm">
                                        <div
                                            className="progress-bar text-bg-danger"
                                            style={{ width: "75%" }}
                                        />
                                    </div>
                                </div>

                                <div className="progress-group">
                                    <span className="progress-text">Visit Premium Page</span>
                                    <span className="float-end">
                                        <b>480</b>/800
                                    </span>
                                    <div className="progress progress-sm">
                                        <div
                                            className="progress-bar text-bg-success"
                                            style={{ width: "60%" }}
                                        />
                                    </div>
                                </div>

                                <div className="progress-group">
                                    Send Inquiries
                                    <span className="float-end">
                                        <b>250</b>/500
                                    </span>
                                    <div className="progress progress-sm">
                                        <div
                                            className="progress-bar text-bg-warning"
                                            style={{ width: "50%" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card Footer */}
                    <div className="card-footer">
                        <div className="row text-center">
                            <div className="col-md-3 col-6 border-end">
                                <span className="text-success">
                                    <i className="bi bi-caret-up-fill"></i> 17%
                                </span>
                                <h5 className="fw-bold mb-0">$35,210.43</h5>
                                <span className="text-uppercase">TOTAL REVENUE</span>
                            </div>

                            <div className="col-md-3 col-6 border-end">
                                <span className="text-info">
                                    <i className="bi bi-caret-left-fill"></i> 0%
                                </span>
                                <h5 className="fw-bold mb-0">$10,390.90</h5>
                                <span className="text-uppercase">TOTAL COST</span>
                            </div>

                            <div className="col-md-3 col-6 border-end">
                                <span className="text-success">
                                    <i className="bi bi-caret-up-fill"></i> 20%
                                </span>
                                <h5 className="fw-bold mb-0">$24,813.53</h5>
                                <span className="text-uppercase">TOTAL PROFIT</span>
                            </div>

                            <div className="col-md-3 col-6">
                                <span className="text-danger">
                                    <i className="bi bi-caret-down-fill"></i> 18%
                                </span>
                                <h5 className="fw-bold mb-0">1200</h5>
                                <span className="text-uppercase">GOAL COMPLETIONS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyRecap;
