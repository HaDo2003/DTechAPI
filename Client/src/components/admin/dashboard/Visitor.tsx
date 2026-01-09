import React, { lazy } from "react";
import type { VisitorCountMonitor } from "../../../types/Dashboard";
import { Link } from "react-router-dom";

const Chart = lazy(() => import("react-apexcharts"));

interface OnlineStoreVisitorsProps {
    visitorCounts: VisitorCountMonitor[];
}

const OnlineStoreVisitors: React.FC<OnlineStoreVisitorsProps> = ({ visitorCounts }) => {
    const groupedByWeek = visitorCounts.reduce((acc, item) => {
        if (item.week !== undefined) {
            if (!acc[item.week]) {
                acc[item.week] = [];
            }
            acc[item.week].push(item);
        }
        return acc;
    }, {} as Record<number, VisitorCountMonitor[]>);

    const weeks = Object.keys(groupedByWeek).map(Number).sort((a, b) => a - b);

    const colors = ["#0d6efd", "#20c997", "#ffc107", "#dc3545"];

    const series = weeks.map((week, _) => {
        const weekData = groupedByWeek[week];
        const dayMap: Record<string, number> = {};

        weekData.forEach(item => {
            if (item.day) {
                const dayShort = item.day.substring(0, 3);
                dayMap[dayShort] = item.count ?? 0;
            }
        });

        const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const data = daysOfWeek.map(day => dayMap[day] || 0);

        return {
            name: `Week ${week}`,
            data: data,
        };
    });

    const totalVisitors = visitorCounts.reduce((sum, item) => sum + (item.count ?? 0), 0);
    
    // Handle empty weeks array safely
    const currentWeek = weeks.length > 0 ? weeks[weeks.length - 1] : undefined;
    const previousWeek = weeks.length > 1 ? weeks[weeks.length - 2] : undefined;

    const currentWeekTotal = currentWeek !== undefined 
        ? (groupedByWeek[currentWeek]?.reduce((sum, item) => sum + (item.count ?? 0), 0) || 0) 
        : 0;
    const previousWeekTotal = previousWeek !== undefined 
        ? (groupedByWeek[previousWeek]?.reduce((sum, item) => sum + (item.count ?? 0), 0) || 0) 
        : 0;

    const percentageChange = previousWeekTotal > 0
        ? (((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100).toFixed(1)
        : 0;

    const isPositive = Number(percentageChange) >= 0;

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const options: any = {
        chart: {
            type: "line",
            fontFamily: "inherit",
            sparkline: { enabled: false },
            toolbar: { show: false },
        },
        colors: colors,
        stroke: {
            width: 5,
            curve: "smooth",
        },
        fill: {
            type: "gradient",
            gradient: {
                shade: "light",
                gradientToColors: colors,
                shadeIntensity: 1,
                type: "horizontal",
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100, 100, 100],
            },
        },
        grid: {
            strokeDashArray: 4,
            borderColor: ["#f3f3f3", "transparent"],
            opacity: 0.5,
        },
        legend: { show: false },
        markers: { size: 3 },
        xaxis: {
            categories: daysOfWeek,
            title: {
                text: "Day of Week",
            },
        },
        yaxis: {
            title: {
                text: "Visitors",
            },
        },
    };

    return (
        <div className="card">
            {/* Card Header */}
            <div className="card-header">
                <div className="d-flex justify-content-between">
                    <h3 className="card-title">Online Store Visitors</h3>

                </div>
            </div>

            {/* Card Body */}
            <div className="card-body" style={{height: '344px'}}>
                {/* Visitors Count */}
                <div className="d-flex">
                    <p className="d-flex flex-column mb-0">
                        <span className="fw-bold fs-5">{totalVisitors}</span>
                        <span>Visitors Over Time</span>
                    </p>

                    <p className="ms-auto d-flex flex-column text-end mb-0">
                        <span className={isPositive ? "text-success" : "text-danger"}>
                            <i className={`bi bi-arrow-${isPositive ? 'up' : 'down'}`}></i> {Math.abs(Number(percentageChange))}%
                        </span>
                        <span className="text-secondary">Since last week</span>
                    </p>
                </div>

                {/* Chart */}
                <div className="position-relative mb-1">
                    {weeks.length > 0 ? (
                        <Chart
                            options={options}
                            series={series}
                            type="line"
                            height={200}
                        />
                    ) : (
                        <div className="text-center text-muted py-5">
                            <p>No visitor data available</p>
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div className="d-flex flex-row justify-content-end flex-wrap gap-2">
                    {weeks.map((week, index) => (
                        <span key={week} className="me-2">
                            <i
                                className="bi bi-square-fill"
                                style={{ color: colors[index] }}
                            ></i> Week {week}
                        </span>
                    ))}
                </div>
            </div>

            <div className="card-footer d-flex justify-content-end align-items-center" style={{height: '45px'}}>
                <Link
                    to="#"
                    className="btn btn-sm btn-secondary float-end"
                >
                    View Report
                </Link>
            </div>
        </div>
    );
};

export default OnlineStoreVisitors;
