import React from "react";

const ForgetPasswordForm = ({ onSwitch }) => {
  return (
    <form className="w-50">
      <h2>Forget Password</h2>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input type="email" className="form-control" id="email" />
      </div>
      <button type="submit" className="btn btn-primary">Reset Password</button>
      <div className="mt-3">
        <p onClick={onSwitch} className="text-primary" style={{ cursor: "pointer" }}>Back to Login</p>
      </div>
    </form>
  );
};

export default ForgetPasswordForm;
