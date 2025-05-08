import React, { useState } from "react";
import { CREATE_CONTACT_MESSAGE_API } from "../../../api/apis";

const ContactForm = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    if(formData.phone && !/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Phone number can only contain digits";
    }

    if (formData.phone && formData.phone.length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits long";
    }

    if (formData.phone && formData.phone.length > 15) {
      newErrors.phone = "Phone number must be at most 15 digits long";
    }

    setErrors(newErrors);
    // return Object.keys(newErrors).length === 0;
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const currentValidationErrors = validateForm(); // lấy currentValidationErrors từ validateForm
    setErrors(currentValidationErrors);

    if (Object.keys(currentValidationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await fetch(CREATE_CONTACT_MESSAGE_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          console.log("Form submitted successfully:", result);
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
          });
          setErrors({});
          if (onFormSubmit) {
            onFormSubmit();
          }
          // nếu có errors
        } else {
          console.error("Form submission error:", result);
          setErrors((prevErrors) => ({
            ...prevErrors,
            api: result.message || "Failed to send message. Please try again.",
          }));
        }
      } catch (error) {
        console.error("Network error:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          api: "An unexpected error occurred. Please check your connection and try again.",
        }));
      } finally {
        setIsSubmitting(false);
      }
      // nếu có error trong validateForm
      // => alert ra lỗi
    } else {
      const errorMessages = Object.entries(currentValidationErrors)
        .map(
          ([field, message]) =>
            `${field.charAt(0).toUpperCase() + field.slice(1)}: ${message}`
        )
        .join("\n");
      alert("Please correct the following errors:\n\n" + errorMessages);
      setErrors((prevErrors) => ({
        ...prevErrors,
        api: "Please fix the errors highlighted above before submitting.",
      }));
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">
          Full Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? "input-error" : ""}
          placeholder="Your name"
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
            placeholder="Your email address"
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your phone number (optional)"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="subject">
          Subject <span className="required">*</span>
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={errors.subject ? "input-error" : ""}
          placeholder="What is this regarding?"
        />
        {errors.subject && (
          <span className="error-message">{errors.subject}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="message">
          Message <span className="required">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={errors.message ? "input-error" : ""}
          placeholder="Please describe your inquiry in detail"
          rows="5"
        ></textarea>
        {errors.message && (
          <span className="error-message">{errors.message}</span>
        )}
      </div>

      {/* <button type="submit" className="form-submit-button">
        Send Message
      </button> */}
      {errors && (
        <span
          className="error-message"
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          {errors.api}
        </span>
      )}
      <button
        type="submit"
        className="form-submit-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactForm;
