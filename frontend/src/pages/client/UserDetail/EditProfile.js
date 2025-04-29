import React, { useState, useEffect } from "react";
import "./UserDetail.css";
import {
  FaEnvelope,
  FaUser,
  FaIdCard,
  FaPhone,
  FaBirthdayCake,
  FaGlobe,
  FaSave,
  FaArrowLeft,
  FaUserCircle,
} from "react-icons/fa";
import User from "../../../api/userApi";

const EditProfile = () => {
  const [userData, setUserData] = useState({
    email: "",
    familyName: "",
    givenName: "",
    membershipCard: "",
    phoneNumber: "",
    dateOfBirth: "",
    nationality: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await User.getUserInfo(token);

        const userDetails = {
          email: response.data.email,
          familyName: response.data.family_name,
          givenName: response.data.given_name,
          membershipCard: response.data.membership,
          phoneNumber: response.data.phone_number,
          dateOfBirth: response.data.birthday ? formatDateForInput(response.data.birthday) : "",
          nationality: response.data.nationality,
        };
        setUserData(userDetails);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to load user profile. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Format date from API (YYYY-MM-DD HH:MM:SS) to input date format (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return dateString.split(" ")[0]; // Get only the YYYY-MM-DD part
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    if (!userData.familyName.trim()) newErrors.familyName = "Family name is required";
    if (!userData.givenName.trim()) newErrors.givenName = "Given name is required";
    if (!userData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";

    // Phone number validation (simple check)
    if (userData.phoneNumber && !/^\d{10,15}$/.test(userData.phoneNumber.replace(/[^0-9]/g, ''))) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    // Date validation
    if (userData.dateOfBirth) {
      const birthDate = new Date(userData.dateOfBirth);
      const today = new Date();
      if (birthDate > today) {
        newErrors.dateOfBirth = "Birth date cannot be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem("accessToken");

      // Prepare data for API
      const updateData = {
        family_name: userData.familyName,
        given_name: userData.givenName,
        phone_number: userData.phoneNumber,
        birthday: userData.dateOfBirth,
        nationality: userData.nationality,
        membership: userData.membershipCard
      };

      // Assuming this API exists in your userApi.js file
      // You'll need to implement this function
      const reponse = await User.editProfile(token, updateData);
      if (reponse.status === 200) {
        alert("Profile updated successfully!");
        window.location.href = "/user-detail";
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Failed to update profile: ${error.message || "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  // List of nationalities for dropdown
  const nationalities = [
    { code: "VI", name: "Vietnam" },
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "JP", name: "Japan" },
    { code: "KR", name: "South Korea" },
    { code: "FR", name: "France" },
    { code: "DE", name: "Germany" },
    { code: "UK", name: "United Kingdom" },
    { code: "AU", name: "Australia" },
  ];

  if (isLoading) {
    return (
      <div className="edit-profile-container">
        <div className="edit-profile-loading">
          <div className="edit-profile-loading-spinner"></div>
          <p>Loading profile information...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="dem"></div>
      <div className="edit-profile-container">
        <div className="edit-profile-content">
          <div className="edit-profile-header">
            <button className="back-button" onClick={handleGoBack}>
              <FaArrowLeft /> Back
            </button>
            <h1 className="edit-profile-title">Edit Your Profile</h1>
          </div>

          <div className="edit-profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <FaUserCircle />
              </div>
              <div className="profile-name">
                <h2>
                  {userData.givenName} {userData.familyName}
                </h2>
                <span className="profile-membership">
                  {userData.membershipCard
                    ? `Member: ${userData.membershipCard}`
                    : "Standard Member"}
                </span>
              </div>
            </div>

            <form className="edit-profile-form" onSubmit={handleSubmit}>
              <div className="profile-sections">
                <div className="profile-section">
                  <h3 className="section-title">Personal Information</h3>
                  <div className="edit-info-grid">
                    <div className="form-group-edit">
                      <label>
                        <FaUser className="field-icon" />
                        Family Name
                      </label>
                      <input
                        type="text"
                        name="familyName"
                        value={userData.familyName}
                        onChange={handleChange}
                        className={errors.familyName ? "input-error" : ""}
                      />
                      {errors.familyName && <span className="error-message">{errors.familyName}</span>}
                    </div>

                    <div className="form-group-edit">
                      <label>
                        <FaUser className="field-icon" />
                        Given Name
                      </label>
                      <input
                        type="text"
                        name="givenName"
                        value={userData.givenName}
                        onChange={handleChange}
                        className={errors.givenName ? "input-error" : ""}
                      />
                      {errors.givenName && <span className="error-message">{errors.givenName}</span>}
                    </div>

                    <div className="form-group-edit">
                      <label>
                        <FaBirthdayCake className="field-icon" />
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={userData.dateOfBirth}
                        onChange={handleChange}
                        className={errors.dateOfBirth ? "input-error" : ""}
                      />
                      {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
                    </div>

                    <div className="form-group-edit">
                      <label>
                        <FaGlobe className="field-icon" />
                        Nationality
                      </label>
                      <select
                        name="nationality"
                        value={userData.nationality}
                        onChange={handleChange}
                      >
                        <option value="">Select a country</option>
                        {nationalities.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="profile-section">
                  <h3 className="section-title">Contact Information</h3>
                  <div className="edit-info-grid">
                    <div className="form-group-edit">
                      <label>
                        <FaEnvelope className="field-icon" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={userData.email}
                        disabled
                        className="disabled-input"
                        title="Email cannot be changed"
                      />
                      <small>Email address cannot be changed</small>
                    </div>

                    <div className="form-group-edit">
                      <label>
                        <FaPhone className="field-icon" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={userData.phoneNumber}
                        onChange={handleChange}
                        className={errors.phoneNumber ? "input-error" : ""}
                      />
                      {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                    </div>

                    <div className="form-group-edit full-width">
                      <label>
                        <FaIdCard className="field-icon" />
                        Membership Card
                      </label>
                      <input
                        type="text"
                        name="membershipCard"
                        value={userData.membershipCard}
                        onChange={handleChange}
                        placeholder="Enter membership card number (if any)"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="save-button"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : (
                    <>
                      <FaSave /> Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleGoBack}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;