import React, { useState } from "react";

const ContactForm = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form submitted with data:", formData);

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Call the callback function
      if (onFormSubmit) {
        onFormSubmit();
      }
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

      <button type="submit" className="form-submit-button">
        Send Message
      </button>
    </form>
  );
};

export default ContactForm;
