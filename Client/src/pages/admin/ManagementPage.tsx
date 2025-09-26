// pages/ManagementPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { managementConfig } from "../../components/admin/page/managementConfig";
import { GenericTable } from "../../components/admin/page/Column";
import { adminService } from "../../services/AdminService";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/shared/Loading";
import CardWrapped from "./CardWrapped";
import AlertForm from "../../components/customer/AlertForm";

const ManagementPage: React.FC = () => {
    const { token } = useAuth();
    const location = useLocation();
    const pathKey = location.pathname.split("/").pop() ?? "";
    const config = managementConfig[pathKey];
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>((location.state as any)?.alert || null);

    // console.log("Config:", config);
    useEffect(() => {
        const tableId = "#dataTable";

        // Destroy previous instance if exists
        if ($.fn.dataTable.isDataTable(tableId)) {
            $(tableId).DataTable().destroy();
        }

        $(tableId).DataTable();
    }, [data]);

    useEffect(() => {
        if (!config) return;

        setLoading(true);
        adminService
            .getData<any>(config.endpoint, token ?? "")
            .then((res) => {
                if (res.success && res.data) {
                    setData(res.data);
                } else {
                    console.error(res.message);
                }
            })
            .finally(() => setLoading(false));
    }, [config, token]);

    const handleEdit = (id: number | string) => {
        if (!config) return;
        navigate(`${config.basePath}/edit/${id}`);
    };

    // handle delete
    const handleDelete = async (id: number | string) => {
        if (!config) return;
        navigate(`${config.basePath}/delete/${id}`);
    };

    if (!config) {
        return <div>Invalid management page</div>;
    }

    const columns = useMemo(() => {
        if (!config) return [];
        return config.columns.map((col) =>
            col.key === "actions"
                ? {
                    ...col,
                    render: (item: any) => (
                        <>
                            <button
                                className="btn btn-sm btn-primary me-1 btn-custom"
                                onClick={() => handleEdit(item.id)}
                            >
                                <i className="fa-solid fa-pen-to-square fa-sm"></i>
                                <span className="hover-text">Edit</span>
                            </button>
                            <button
                                className="btn btn-sm btn-danger btn-custom"
                                onClick={() => handleDelete(item.id)}
                            >
                                <i className="fa-solid fa-trash fa-sm"></i>
                                <span className="hover-text">Delete</span>
                            </button>
                        </>
                    ),
                }
                : col
        );
    }, [config, handleEdit, handleDelete]);

    return (
        <>
            <CardWrapped title={`${config.label} Management`}>
                <>
                    <div className="card-header">
                        <div className="row">
                            <div className="col">
                                <strong className="card-title">{config.label} Information</strong>
                            </div>
                            <div className="col text-end">
                                <button
                                    className="btn btn-sm btn-success text-end"
                                    onClick={() => navigate(`${config.basePath}/create`)}
                                >
                                    <i className="fa-solid fa-plus fa-sm"></i> Create New
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card-body py-1">
                        {loading ? (
                            <Loading />
                        ) : (
                            <GenericTable data={data} columns={columns} />
                        )}
                    </div>
                </>
            </CardWrapped>

            {alert && (
                <AlertForm
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
        </>
    );
};

export default ManagementPage;
