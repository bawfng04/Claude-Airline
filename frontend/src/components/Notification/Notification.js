import React, { useState, useEffect } from "react";
import "./Notification.css";

const Notification = ({
  message,
  type = "info",
  duration = 0,
  onClose = () => {},
}) => {
  const [isDisplayed, setIsDisplayed] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let timer;
    if (duration > 0) {
      timer = setTimeout(() => {
        closeNotification();
      }, duration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [duration]);

  const closeNotification = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsDisplayed(false);
      onClose();
    }, 500); // Wait for exit animation to complete
  };

  if (!isDisplayed) return null;

  return (
    <div
      className={`notification-container ${type} ${isExiting ? "exit" : ""}`}
      role="alert"
    >
      <div className="notification-icon">
        {type === "success" && <SuccessIcon />}
        {type === "error" && <ErrorIcon />}
        {type === "warning" && <WarningIcon />}
        {type === "info" && <InfoIcon />}
      </div>
      <div className="notification-content">
        <div className="notification-message">{message}</div>
      </div>
      <button
        className="notification-close-button"
        onClick={closeNotification}
        aria-label="Close notification"
      >
        <CloseIcon />
      </button>
    </div>
  );
};

// SVG Icons
const SuccessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default Notification;
