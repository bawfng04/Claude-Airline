import React, { useState } from "react";
import "./Login.css";
import airplaneLogo from "../../../../assets/airplaneLogo.jpg";
import {
  FaEnvelope,
  FaLock,
  FaCheck,
  FaSpinner,
  FaHome,
  FaUserPlus,
} from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  const validateForm = () => {
    const errors = {};
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      errors.email = "Email address is invalid";

    if (!password) errors.password = "Password is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("Login submitted:", {
          email,
          password,
          rememberMe,
        });

        setSubmitSuccess(true);
        setTimeout(() => {
          // Redirect to dashboard after success
          // window.location.href = "/dashboard";
        }, 2000);
      } catch (error) {
        console.error("Error during login:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (submitSuccess) {
    return (
      <div className="login-container">
        <div className="login-container-content success-container">
          <div className="success-icon">
            <FaCheck />
          </div>
          <h1 className="login-title">Login Successful!</h1>
          <p className="login-subtitle">
            You've successfully logged in. Redirecting you to your dashboard...
          </p>
          <a href="/dashboard" className="login-button">
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-container-content">
        <div className="login-title-container">
          <img
            src={airplaneLogo}
            alt="Logo"
            className="login-logo"
            onClick={handleLogoClick}
          />
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">
            Log in to access your account and travel plans
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-section">
            <h2 className="section-title">Account Information</h2>

            {/* Email field */}
            <div className="form-group">
              <label className="login-form-label">
                Email <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  className={`login-input ${
                    formErrors.email ? "input-error" : ""
                  }`}
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {formErrors.email && (
                <span className="error-message">{formErrors.email}</span>
              )}
            </div>

            {/* Password field */}
            <div className="form-group">
              <label className="login-form-label">
                Password <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  className={`login-input ${
                    formErrors.password ? "input-error" : ""
                  }`}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {formErrors.password && (
                <span className="error-message">{formErrors.password}</span>
              )}
            </div>

            {/* Remember me & Forgot Password */}
            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="/forgot-password" className="forgot-password">
                Forgot Password?
              </a>
            </div>
          </div>

          <div className="login-links-container">
            <a href="/" className="login-register-link">
              <FaHome className="link-icon" /> Back to homepage
            </a>
            <a href="/register" className="login-register-link">
              <FaUserPlus className="link-icon" /> Create account
            </a>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="spinner-icon" /> Processing...
              </>
            ) : (
              "Login to Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
