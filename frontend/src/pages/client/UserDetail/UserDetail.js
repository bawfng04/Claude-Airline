import React, { useState, useEffect } from "react";
import "./UserDetail.css";
// import airplaneLogo from "../../../assets/airplaneLogo.jpg";
import {
  FaEnvelope,
  FaUser,
  FaIdCard,
  FaPhone,
  FaBirthdayCake,
  FaGlobe,
  FaEdit,
  FaArrowLeft,
  FaUserCircle,
} from "react-icons/fa";
import User from "../../../api/userApi"

const UserDetail = () => {
  const [userData, setUserData] = useState({
    email: "",
    familyName: "",
    givenName: "",
    membershipCard: "",
    phoneNumber: "",
    dateOfBirth: "",
    nationality: "",
    image: ""
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        
        const response = await User.getUserInfo(token);
        
        const userDetails = {
          email: response.data.email,
          familyName: response.data.family_name,
          givenName: response.data.given_name,
          membershipCard: response.data.membership,
          phoneNumber: response.data.phone_number,
          dateOfBirth: response.data.birthday,
          nationality: response.data.nationality,
          image: response.data.image
        };
        setUserData(userDetails);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  const handleEdit = () => {
    // Navigate to edit profile page
    window.location.href = "/profile/edit";
  };

  const getNationalityText = (code) => {
    const nationalities = {
      US: "United States",
      CA: "Canada",
      VI: "Vietnam",
      JP: "Japan",
      KR: "South Korea",
    };
    return nationalities[code] || code;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="detail-container">
        <div className="detail-loading">
          <div className="detail-loading-spinner"></div>
          <p>Loading profile information...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="dem"></div>
      <div className="detail-container">
        <div className="detail-content">
          <div className="detail-header">
            <button className="back-button" onClick={handleGoBack}>
              <FaArrowLeft /> Back
            </button>
            <h1 className="detail-title">Your Profile</h1>
          </div>

          <div className="detail-card">
            <div className="profile-header">
              <div className="profile-avatar">
              <img
                src={`${process.env.REACT_APP_BASE_URL}uploads/${userData.image}`} // Đường dẫn ảnh hoặc ảnh mặc định
                alt="User Avatar"
                className="avatar-image"
              />
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
              <button className="edit-profile-button" onClick={handleEdit}>
                <FaEdit /> Edit Profile
              </button>
            </div>

            <div className="profile-sections">
              <div className="profile-section">
                <h3 className="section-title">Personal Information</h3>
                <div className="detail-info-grid">
                  <div className="detail-info-item">
                    <div className="detail-info-label">
                      <FaUser className="detail-icon" />
                      <span>Family Name</span>
                    </div>
                    <div className="detail-info-value">
                      {userData.familyName}
                    </div>
                  </div>

                  <div className="detail-info-item">
                    <div className="detail-info-label">
                      <FaUser className="detail-icon" />
                      <span>Given Name</span>
                    </div>
                    <div className="detail-info-value">
                      {userData.givenName}
                    </div>
                  </div>

                  <div className="detail-info-item">
                    <div className="detail-info-label">
                      <FaBirthdayCake className="detail-icon" />
                      <span>Date of Birth</span>
                    </div>
                    <div className="detail-info-value">
                      {formatDate(userData.dateOfBirth)}
                    </div>
                  </div>

                  <div className="detail-info-item">
                    <div className="detail-info-label">
                      <FaGlobe className="detail-icon" />
                      <span>Nationality</span>
                    </div>
                    <div className="detail-info-value">
                      {getNationalityText(userData.nationality)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3 className="section-title">Contact Information</h3>
                <div className="detail-info-grid">
                  <div className="detail-info-item">
                    <div className="detail-info-label">
                      <FaEnvelope className="detail-icon" />
                      <span>Email</span>
                    </div>
                    <div className="detail-info-value">{userData.email}</div>
                  </div>

                  <div className="detail-info-item">
                    <div className="detail-info-label">
                      <FaPhone className="detail-icon" />
                      <span>Phone Number</span>
                    </div>
                    <div className="detail-info-value">
                      {userData.phoneNumber}
                    </div>
                  </div>

                  <div className="detail-info-item full-width">
                    <div className="detail-info-label">
                      <FaIdCard className="detail-icon" />
                      <span>Membership Card</span>
                    </div>
                    <div className="detail-info-value">
                      {userData.membershipCard ||
                        "No membership card registered"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-actions">
              <button
                className="detail-button primary"
                onClick={() => (window.location.href = "/bookings")}
              >
                View My Bookings
              </button>
              <button
                className="detail-button secondary"
                onClick={() => (window.location.href = "/")}
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
