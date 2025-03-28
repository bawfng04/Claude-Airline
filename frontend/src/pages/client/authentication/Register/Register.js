import React, { useState } from "react";
import "./Register.css";
import airplaneLogo from "../../../../assets/airplaneLogo.jpg";
import {
  FaEnvelope,
  FaUser,
  FaIdCard,
  FaPhone,
  FaBirthdayCake,
  FaGlobe,
  FaLock,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [givenName, setGivenName] = useState("");
  const [membershipCard, setMembershipCard] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationality, setNationality] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  const validateForm = () => {
    const errors = {};
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      errors.email = "Email address is invalid";

    if (!password) errors.password = "Password is required";
    else if (password.length < 8)
      errors.password = "Password must be at least 8 characters";

    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    if (!familyName) errors.familyName = "Family name is required";
    if (!givenName) errors.givenName = "Given name is required";
    if (!dateOfBirth) errors.dateOfBirth = "Date of birth is required";
    if (!nationality) errors.nationality = "Nationality is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("Form submitted:", {
          email,
          familyName,
          givenName,
          membershipCard,
          phoneNumber,
          dateOfBirth,
          nationality,
        });

        setSubmitSuccess(true);
        setTimeout(() => {
          // Redirect or reset form after success
          // window.location.href = "/login";
        }, 2000);
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (submitSuccess) {
    return (
      <div className="register-container">
        <div className="register-container-content success-container">
          <div className="success-icon">
            <FaCheck />
          </div>
          <h1 className="register-title">Registration Successful!</h1>
          <p className="register-subtitle">
            Your account has been created successfully. You can now log in to
            access exclusive travel deals and benefits.
          </p>
          <a href="/login" className="register-button">
            Proceed to Login
          </a>
        </div>
      </div>
    );
  }

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
          <h1 className="register-title">Create Your Account</h1>
          <p className="register-subtitle">
            Join us to access exclusive travel deals and benefits
          </p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-section">
            <h2 className="section-title">Personal Information</h2>

            <div className="form-row">
              {/* Family Name */}
              <div className="form-group">
                <label className="register-form-label">
                  Family Name <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <FaUser className="input-icon" />
                  <input
                    className={`register-input ${
                      formErrors.familyName ? "input-error" : ""
                    }`}
                    type="text"
                    placeholder="Family Name"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    required
                  />
                </div>
                {formErrors.familyName && (
                  <span className="error-message">{formErrors.familyName}</span>
                )}
              </div>

              {/* Given Name */}
              <div className="form-group">
                <label className="register-form-label">
                  Given Name <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <FaUser className="input-icon" />
                  <input
                    className={`register-input ${
                      formErrors.givenName ? "input-error" : ""
                    }`}
                    type="text"
                    placeholder="Given Name"
                    value={givenName}
                    onChange={(e) => setGivenName(e.target.value)}
                    required
                  />
                </div>
                {formErrors.givenName && (
                  <span className="error-message">{formErrors.givenName}</span>
                )}
              </div>
            </div>

            {/* Date of Birth & Nationality */}
            <div className="form-row">
              <div className="form-group">
                <label className="register-form-label">
                  Date of Birth <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <FaBirthdayCake className="input-icon" />
                  <input
                    className={`register-input ${
                      formErrors.dateOfBirth ? "input-error" : ""
                    }`}
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                  />
                </div>
                {formErrors.dateOfBirth && (
                  <span className="error-message">
                    {formErrors.dateOfBirth}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="register-form-label">
                  Nationality <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <FaGlobe className="input-icon" />
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className={`register-input ${
                      formErrors.nationality ? "input-error" : ""
                    }`}
                    required
                  >
                    <option value="">Select your nationality</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="VI">Vietnam</option>
                    <option value="JP">Japan</option>
                    <option value="KR">South Korea</option>
                  </select>
                </div>
                {formErrors.nationality && (
                  <span className="error-message">
                    {formErrors.nationality}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="form-divider"></div>

          <div className="form-section">
            <h2 className="section-title">Contact Information</h2>

            {/* Email */}
            <div className="form-group">
              <label className="register-form-label">
                Email <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  className={`register-input ${
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

            {/* Phone Number */}
            <div className="form-group">
              <label className="register-form-label">Phone Number</label>
              <div className="input-with-icon">
                <FaPhone className="input-icon" />
                <input
                  className="register-input"
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            {/* Membership Card */}
            <div className="form-group">
              <label className="register-form-label">Membership Card</label>
              <div className="input-with-icon">
                <FaIdCard className="input-icon" />
                <input
                  className="register-input"
                  type="text"
                  placeholder="Membership Card (if any)"
                  value={membershipCard}
                  onChange={(e) => setMembershipCard(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-divider"></div>

          <div className="form-section">
            <h2 className="section-title">Account Security</h2>

            {/* Password */}
            <div className="form-group">
              <label className="register-form-label">
                Password <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  className={`register-input ${
                    formErrors.password ? "input-error" : ""
                  }`}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              {formErrors.password && (
                <span className="error-message">{formErrors.password}</span>
              )}
              {passwordStrength > 0 && (
                <div className="password-strength">
                  <div className="strength-meter">
                    <div
                      className={`strength-meter-fill strength-${passwordStrength}`}
                      style={{ width: `${passwordStrength * 25}%` }}
                    ></div>
                  </div>
                  <span className="strength-text">
                    {passwordStrength === 1 && "Weak"}
                    {passwordStrength === 2 && "Fair"}
                    {passwordStrength === 3 && "Good"}
                    {passwordStrength === 4 && "Strong"}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="register-form-label">
                Confirm Password <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  className={`register-input ${
                    formErrors.confirmPassword ? "input-error" : ""
                  }`}
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {formErrors.confirmPassword && (
                <span className="error-message">
                  {formErrors.confirmPassword}
                </span>
              )}
            </div>
          </div>

          <div className="terms-privacy">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <a href="/terms">Terms of Service</a> and{" "}
              <a href="/privacy">Privacy Policy</a>
            </label>
          </div>

          <div className="register-links-container">
            <a href="/" className="register-login-link">
              Back to homepage
            </a>
            <a href="/login" className="register-login-link">
              Already have an account? Login
            </a>
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="spinner-icon" /> Processing...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
