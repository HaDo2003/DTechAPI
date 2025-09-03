import React from "react";

const ChangePassword: React.FC = () => {
    return (
        <div>
            <h5>Change Password</h5>
            <form>
                <input type="password" placeholder="Old Password" className="form-control mb-2" />
                <input type="password" placeholder="New Password" className="form-control mb-2" />
                <input type="password" placeholder="Confirm Password" className="form-control mb-2" />
                <button type="submit" className="btn btn-primary">Update Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;