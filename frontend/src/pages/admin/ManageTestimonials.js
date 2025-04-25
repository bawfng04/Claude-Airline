import React, { useState, useEffect } from "react";
import {
  GET_TESTIMONIALS_API,
  CREATE_TESTIMONIAL_API,
  DELETE_TESTIMONIAL_API,
  UPDATE_TESTIMONIAL_API,
  API_URL,
} from "../../bang_config/apis";
import "./AdminHomepage.css"; // Sử dụng CSS chung
import { FaStar } from "react-icons/fa"; // Import sao để hiển thị rating

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // State cho form sửa
  const [editingTestimonial, setEditingTestimonial] = useState({
    id: "",
    user_image: "", // URL ảnh hiện tại (tương đối)
    user_name: "",
    user_testimonial: "",
    user_stars: 0,
    user_location: "",
  });
  const [editingFile, setEditingFile] = useState(null);
  const [editingImagePreview, setEditingImagePreview] = useState("");

  // State cho form thêm mới
  const [newTestimonial, setNewTestimonial] = useState({
    user_name: "",
    user_testimonial: "",
    user_stars: 0,
    user_location: "",
  });
  const [newFile, setNewFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState("");

  // --- Hàm fetch dữ liệu ---
  const fetchTestimonials = async () => {
    try {
      const response = await fetch(GET_TESTIMONIALS_API);
      const result = await response.json();
      if (result.status === 200 && Array.isArray(result.data)) {
        const testimonialsWithFullImagePath = result.data.map((t) => ({
          ...t,
          fullImagePath: t.user_image ? `${API_URL}${t.user_image}` : null,
          user_stars: parseInt(t.user_stars, 10) || 0, // Đảm bảo là số nguyên
        }));
        setTestimonials(testimonialsWithFullImagePath);
      } else {
        console.error("Error fetching testimonials:", result.message);
        alert(`Error: ${result.message || "Failed to fetch testimonials"}`);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      alert(`Failed to fetch testimonials: ${error.message}`);
    }
  };

  // --- Xử lý xóa ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }
    try {
      const response = await fetch(`${DELETE_TESTIMONIAL_API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => response.text());
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${
            typeof errorData === "string"
              ? errorData
              : JSON.stringify(errorData)
          }`
        );
      }

      const result = await response.json();

      if (result.status === 200) {
        alert("Testimonial deleted successfully!");
        fetchTestimonials();
      } else {
        throw new Error(result.message || "Failed to delete testimonial");
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      alert(`Failed to delete testimonial: ${error.message}`);
    }
  };

  // --- Xử lý mở/đóng Modal Sửa ---
  const handleModifyClick = (testimonial) => {
    setEditingTestimonial({
      id: testimonial.id,
      user_image: testimonial.user_image, // Lưu đường dẫn tương đối
      user_name: testimonial.user_name,
      user_testimonial: testimonial.user_testimonial,
      user_stars: testimonial.user_stars,
      user_location: testimonial.user_location,
    });
    setEditingImagePreview(testimonial.fullImagePath || "");
    setEditingFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingImagePreview("");
  };

  // --- Xử lý thay đổi input trong Modal Sửa ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingTestimonial({
      ...editingTestimonial,
      [name]: name === "user_stars" ? parseInt(value, 10) : value, // Chuyển stars thành số
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setEditingFile(null);
      const originalT = testimonials.find(
        (t) => t.id === editingTestimonial.id
      );
      setEditingImagePreview(originalT?.fullImagePath || "");
    }
  };

  // --- Xử lý Submit Modal Sửa ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("user_name", editingTestimonial.user_name);
    formData.append("user_testimonial", editingTestimonial.user_testimonial);
    formData.append("user_stars", editingTestimonial.user_stars);
    formData.append("user_location", editingTestimonial.user_location);

    if (editingFile) {
      formData.append("user_image", editingFile); // Tên field khớp backend
    }

    try {
      const response = await fetch(
        `${UPDATE_TESTIMONIAL_API}/${editingTestimonial.id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => response.text());
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${
            typeof errorData === "string"
              ? errorData
              : JSON.stringify(errorData)
          }`
        );
      }

      const result = await response.json();

      if (result.status === 200) {
        alert("Testimonial updated successfully!");
        closeModal();
        fetchTestimonials();
      } else {
        throw new Error(result.message || "Failed to update testimonial");
      }
    } catch (error) {
      console.error("Error updating testimonial:", error);
      alert(`Failed to update testimonial: ${error.message}`);
    }
  };

  // --- Xử lý mở/đóng Modal Thêm ---
  const openAddModal = () => {
    setNewTestimonial({
      user_name: "",
      user_testimonial: "",
      user_stars: 0,
      user_location: "",
    });
    setNewFile(null);
    setNewImagePreview("");
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // --- Xử lý thay đổi input trong Modal Thêm ---
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewTestimonial({
      ...newTestimonial,
      [name]: name === "user_stars" ? parseInt(value, 10) : value, // Chuyển stars thành số
    });
  };

  const handleAddFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setNewFile(null);
      setNewImagePreview("");
    }
  };

  // --- Xử lý Submit Modal Thêm ---
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!newFile) {
      alert("Please select an image for the new testimonial.");
      return;
    }
    if (newTestimonial.user_stars < 1 || newTestimonial.user_stars > 5) {
      alert("Rating must be between 1 and 5 stars.");
      return;
    }
    if (
      !newTestimonial.user_name ||
      !newTestimonial.user_testimonial ||
      !newTestimonial.user_location
    ) {
      alert(
        "Please fill in all required fields (Name, Testimonial, Location, Stars)."
      );
      return;
    }

    const formData = new FormData();
    formData.append("user_name", newTestimonial.user_name);
    formData.append("user_testimonial", newTestimonial.user_testimonial);
    formData.append("user_stars", newTestimonial.user_stars);
    formData.append("user_location", newTestimonial.user_location);
    formData.append("user_image", newFile); // Tên field khớp backend

    try {
      const response = await fetch(CREATE_TESTIMONIAL_API, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => response.text());
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${
            typeof errorData === "string"
              ? errorData
              : JSON.stringify(errorData)
          }`
        );
      }

      const result = await response.json();

      if (result.status === 201) {
        // Created
        alert("Testimonial created successfully!");
        closeAddModal();
        fetchTestimonials();
      } else {
        throw new Error(result.message || "Failed to create testimonial");
      }
    } catch (error) {
      console.error("Error creating testimonial:", error);
      alert(`Failed to create testimonial: ${error.message}`);
    }
  };

  // --- useEffect để fetch dữ liệu lần đầu ---
  useEffect(() => {
    fetchTestimonials();
  }, []);

  // --- Hàm render sao ---
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={i < rating ? "star-filled" : "star-empty"}
        style={{
          color: i < rating ? "#ffc107" : "#e4e5e9",
          marginRight: "2px",
        }}
      />
    ));
  };

  // --- JSX ---
  return (
    <div className="manage-destination-container">
      {" "}
      {/* Sử dụng class chung */}
      <div className="dem"></div>
      <h1>Manage User Testimonials</h1>
      <button className="add-btn" onClick={openAddModal}>
        Add New Testimonial
      </button>
      {/* --- Bảng hiển thị --- */}
      <div className="table-responsive">
        <table className="destination-table">
          {" "}
          {/* Sử dụng class chung */}
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Location</th>
              <th>Rating</th>
              <th>Testimonial</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>
                  <div className="image-preview">
                    {t.fullImagePath ? (
                      <img
                        src={t.fullImagePath}
                        alt={t.user_name}
                        className="destination-image" // Reuse class
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </div>
                </td>
                <td>{t.user_name}</td>
                <td>{t.user_location}</td>
                <td>
                  {renderStars(t.user_stars)} ({t.user_stars})
                </td>
                <td className="description-cell">{t.user_testimonial}</td>
                <td className="action-column">
                  <button
                    className="modify-btn"
                    onClick={() => handleModifyClick(t)}
                  >
                    Modify
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(t.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* --- Edit Modal --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Testimonial</h2>
            <form onSubmit={handleSubmit}>
              {/* Image */}
              <div className="form-group">
                <label>User Image:</label>
                {editingImagePreview && (
                  <img
                    src={editingImagePreview}
                    alt="Preview"
                    className="modal-image-preview"
                  />
                )}
                <input
                  type="file"
                  name="user_image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="input-text"
                />
                <small>Leave blank to keep the current image.</small>
              </div>

              {/* Name */}
              <div className="form-group">
                <label>User Name:</label>
                <input
                  type="text"
                  name="user_name"
                  value={editingTestimonial.user_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter user name"
                  className="input-text"
                />
              </div>

              {/* Location */}
              <div className="form-group">
                <label>User Location:</label>
                <input
                  type="text"
                  name="user_location"
                  value={editingTestimonial.user_location}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., London, UK"
                />
              </div>

              {/* Rating */}
              <div className="form-group">
                <label>Rating (1-5):</label>
                <input
                  type="number"
                  name="user_stars"
                  value={editingTestimonial.user_stars}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="5"
                  step="1"
                  placeholder="Enter rating (1-5)"
                  className="input-text"
                />
              </div>

              {/* Testimonial Text */}
              <div className="form-group">
                <label>Testimonial:</label>
                <textarea
                  name="user_testimonial"
                  value={editingTestimonial.user_testimonial}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Enter testimonial text"
                  className="input-text"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* --- Add Modal --- */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Testimonial</h2>
            <form onSubmit={handleAddSubmit}>
              {/* Image */}
              <div className="form-group">
                <label>User Image:</label>
                {newImagePreview && (
                  <img
                    src={newImagePreview}
                    alt="New Preview"
                    className="modal-image-preview"
                  />
                )}
                <input
                  type="file"
                  name="user_image"
                  accept="image/*"
                  onChange={handleAddFileChange}
                  required // Bắt buộc ảnh khi thêm mới
                  className="input-text"
                />
              </div>

              {/* Name */}
              <div className="form-group">
                <label>User Name:</label>
                <input
                  type="text"
                  name="user_name"
                  value={newTestimonial.user_name}
                  onChange={handleAddInputChange}
                  required
                  className="input-text"
                  placeholder="Enter user name"
                />
              </div>

              {/* Location */}
              <div className="form-group">
                <label>User Location:</label>
                <input
                  type="text"
                  name="user_location"
                  value={newTestimonial.user_location}
                  onChange={handleAddInputChange}
                  required
                  placeholder="e.g., London, UK"
                  className="input-text"
                />
              </div>

              {/* Rating */}
              <div className="form-group">
                <label>Rating (1-5):</label>
                <input
                  type="number"
                  name="user_stars"
                  value={newTestimonial.user_stars}
                  onChange={handleAddInputChange}
                  required
                  min="1"
                  max="5"
                  step="1"
                  placeholder="Enter rating (1-5)"
                  className="input-text"
                />
              </div>

              {/* Testimonial Text */}
              <div className="form-group">
                <label>Testimonial:</label>
                <textarea
                  name="user_testimonial"
                  value={newTestimonial.user_testimonial}
                  onChange={handleAddInputChange}
                  required
                  rows="4"
                  placeholder="Enter testimonial text"
                  className="input-text"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Add Testimonial
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeAddModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTestimonials;
