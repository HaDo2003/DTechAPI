import React from "react";
import Chart from "react-apexcharts";

const OnlineStoreVisitors: React.FC = () => {
    const options: ApexCharts.ApexOptions = {
        chart: {
            height: 200,
            type: "line",
            toolbar: { show: false },
        },
        colors: ["#0d6efd", "#adb5bd"],
        stroke: { curve: "smooth" },
        grid: {
            borderColor: "#e7e7e7",
            row: {
                colors: ["#f3f3f3", "transparent"],
                opacity: 0.5,
            },
        },
        legend: { show: false },
        markers: { size: 1 },
        xaxis: {
            categories: ["22th", "23th", "24th", "25th", "26th", "27th", "28th"],
        },
    };

    const series = [
        {
            name: "High - 2023",
            data: [100, 120, 170, 167, 180, 177, 160],
        },
        {
            name: "Low - 2023",
            data: [60, 80, 70, 67, 80, 77, 100],
        },
    ];

    return (
        <div className="card mb-4">
            {/* Card Header */}
            <div className="card-header border-0">
                <div className="d-flex justify-content-between">
                    <h3 className="card-title">Online Store Visitors</h3>
                    <a
                        href="#"
                        className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                    >
                        View Report
                    </a>
                </div>
            </div>

            {/* Card Body */}
            <div className="card-body">
                {/* Visitors Count */}
                <div className="d-flex">
                    <p className="d-flex flex-column mb-0">
                        <span className="fw-bold fs-5">820</span>
                        <span>Visitors Over Time</span>
                    </p>

                    <p className="ms-auto d-flex flex-column text-end mb-0">
                        <span className="text-success">
                            <i className="bi bi-arrow-up"></i> 12.5%
                        </span>
                        <span className="text-secondary">Since last week</span>
                    </p>
                </div>

                {/* Chart */}
                <div className="position-relative mb-4">
                    <Chart
                        options={options}
                        series={series}
                        type="line"
                        height={200}
                    />
                </div>

                {/* Legend */}
                <div className="d-flex flex-row justify-content-end">
                    <span className="me-2">
                        <i className="bi bi-square-fill text-primary"></i> This Week
                    </span>
                    <span>
                        <i className="bi bi-square-fill text-secondary"></i> Last Week
                    </span>
                </div>
            </div>
        </div>
    );
};

export default OnlineStoreVisitors;
