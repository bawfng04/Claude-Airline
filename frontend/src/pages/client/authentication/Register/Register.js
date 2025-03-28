import React, { useState } from "react";
import "./Register.css";
import Logo from "../../../../assets/Logo.png";
import airplaneLogo from "../../../../assets/airplaneLogo.jpg";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log(email, password);
  };

  return (
    <div className="register-container">
      <div className="register-container-content">
        <div className="register-title-container">
          <img
            src={airplaneLogo}
            alt="Logo"
            className="register-logo"
            onClick={handleLogoClick}
          />
          <h1 className="register-title">Register</h1>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <label className="register-form-label">Email</label>
          <input
            className="register-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="register-form-label">Password</label>
          <input
            className="register-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="register-form-label">Confirm Password</label>
          <input
            className="register-input"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="register-links-container">
            <a href="/home" className="register-login-link">
              Back to homepage
            </a>
            <a href="/login" className="register-login-link">
              Login
            </a>
          </div>

          <button type="submit" className="register-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
