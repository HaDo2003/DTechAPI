import React from "react";
import { Link } from "react-router-dom";

type Props = {
    title: string;
    children: React.ReactNode;
};

const CardWrapped: React.FC<Props> = ({ title, children }) => {
    return (
        <>
            <div className="app-content-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <h3 className="mb-0">{title}</h3>
                        </div>
                        <div className="col-sm-6" aria-label="breadcrumb">
                            <ol className="breadcrumb float-sm-end">
                                <li className="breadcrumb-item">
                                    <Link className="btn btn-sm btn-success text-center" to={"/admin"}>
                                        <i className="fa-solid fa-house fa-sm"></i>
                                        Home
                                    </Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    {title}
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <div className="app-content">
                <div className="container-fluid">
                    <div className="card">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CardWrapped;