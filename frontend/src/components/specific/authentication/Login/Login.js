import React, { useState } from "react";
import "./Login.css";
import Logo from "../../../../assets/Logo.png";
import airplaneLogo from "../../../../assets/airplaneLogo.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
  };

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
          <h1 className="login-title">Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-form-label">Email</label>
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="login-form-label">Password</label>
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="login-links-container">
            <a href="/home" className="login-register-link">
              Back to homepage
            </a>
            <a href="/register" className="login-register-link">
              Register
            </a>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
