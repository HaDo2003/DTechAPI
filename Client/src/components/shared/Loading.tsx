import React from "react";

interface LoadingProps {
    size?: number;
}

const Loading: React.FC<LoadingProps> = ({ size = 80 }) => {
    return (
        <div className="content-loader">
            <div className="loader-container" data-size={size}>
                <div className="loader-border"></div>
            </div>
        </div>
    );
};

export default Loading;