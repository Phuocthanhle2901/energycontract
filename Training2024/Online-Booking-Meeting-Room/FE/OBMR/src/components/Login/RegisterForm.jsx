import React from "react";

const RegisterForm = () => {
  return (
    <form className="col-lg-4 col-md-6 shadow p-4 mx-auto login-form">
      <div className="text-center">
        <h2 className="">Register</h2>

        <div className="mb-1 text-start">
          <label htmlFor="username" className="form-label">Username</label>
          <input type="text" className="form-control" id="username" />
        </div>

        <div className="mb-1 text-start">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="text" className="form-control" id="email" />
        </div>

        <div className="mb-1 text-start">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" />
        </div>

        <div className="mb-3 text-start">
          <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
          <input type="confirm-password" className="form-control" id="confirm-password" />
        </div>

        <button type="submit" className="btn btn-login w-50 mb-1">Register</button>

        <div className="mb-3">
          Have an account? <a href="/login" className="">Login</a>
        </div>

        <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
        </div>

        <div className="d-grid gap-2">
          <button type="button" className="btn btn-login-other">
            <i className="fab fa-google"></i> Continue with Google
          </button>
          <button type="button" className="btn btn-login-other">
            <i className="fab fa-facebook"></i> Continue with Facebook
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
