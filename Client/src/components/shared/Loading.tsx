import React from "react";

interface LoadingProps {
    size?: number;
    overlay?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ size = 80, overlay = true }) => {
    const loader = (
        <div className="loader-container" style={{ width: size, height: size }}>
            <div className="loader-border"></div>
        </div>
    );

    if (!overlay) {
        // inline loader (no overlay)
        return loader;
    }

    return (
        <div
            className="loading-overlay d-flex justify-content-center align-items-center"
        >
            {loader}
        </div>
    );
};

export default Loading;