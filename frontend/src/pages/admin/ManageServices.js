import React, { useState, useEffect } from "react";
import {
  GET_SERVICES_API,
  CREATE_SERVICE_API,
  DELETE_SERVICE_API,
  UPDATE_SERVICE_API,
  API_URL, // Import API_URL để ghép đường dẫn ảnh
} from "../../bang_config/apis";
import "./AdminHomepage.css"; // Sử dụng CSS chung

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // State cho form sửa
  const [editingService, setEditingService] = useState({
    id: "",
    service_image: "", // URL ảnh hiện tại
    service_title: "",
    service_description: "",
  });
  const [editingFile, setEditingFile] = useState(null); // File ảnh mới khi sửa
  const [editingImagePreview, setEditingImagePreview] = useState(""); // Preview ảnh khi sửa

  // State cho form thêm mới
  const [newService, setNewService] = useState({
    service_title: "",
    service_description: "",
  });
  const [newFile, setNewFile] = useState(null); // File ảnh mới khi thêm
  const [newImagePreview, setNewImagePreview] = useState(""); // Preview ảnh khi thêm

  // --- Hàm fetch dữ liệu ---
  const fetchServices = async () => {
    try {
      const response = await fetch(GET_SERVICES_API);
      const result = await response.json();
      if (result.status === 200 && Array.isArray(result.data)) {
        // Ghép URL đầy đủ cho ảnh
        const servicesWithFullImagePath = result.data.map((svc) => ({
          ...svc,
          fullImagePath: svc.service_image
            ? `${API_URL}${svc.service_image}` // Ghép URL đầy đủ
            : null,
        }));
        setServices(servicesWithFullImagePath);
      } else {
        console.error("Error fetching services:", result.message);
        alert(`Error: ${result.message || "Failed to fetch services"}`);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      alert(`Failed to fetch services: ${error.message}`);
    }
  };

  // --- Xử lý xóa ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }
    try {
      // API delete thường nhận ID qua URL parameter hoặc query string
      const response = await fetch(`${DELETE_SERVICE_API}/${id}`, {
        method: "DELETE", // Hoặc POST/GET tùy backend của bạn
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
        alert("Service deleted successfully!");
        fetchServices(); // Tải lại danh sách
      } else {
        throw new Error(result.message || "Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert(`Failed to delete service: ${error.message}`);
    }
  };

  // --- Xử lý mở/đóng Modal Sửa ---
  const handleModifyClick = (service) => {
    setEditingService({
      id: service.id,
      service_image: service.service_image, // Lưu đường dẫn tương đối
      service_title: service.service_title,
      service_description: service.service_description,
    });
    setEditingImagePreview(service.fullImagePath || ""); // Hiển thị ảnh hiện tại
    setEditingFile(null); // Reset file mới
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingImagePreview(""); // Reset preview khi đóng
  };

  // --- Xử lý thay đổi input trong Modal Sửa ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingService({
      ...editingService,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingFile(file);
      // Tạo preview cho ảnh mới
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // Nếu hủy chọn file, quay lại ảnh gốc (nếu có)
      setEditingFile(null);
      const originalSvc = services.find((s) => s.id === editingService.id);
      setEditingImagePreview(originalSvc?.fullImagePath || "");
    }
  };

  // --- Xử lý Submit Modal Sửa ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Thêm các trường dữ liệu vào FormData
    formData.append("service_title", editingService.service_title);
    formData.append("service_description", editingService.service_description);

    // Chỉ thêm file ảnh nếu người dùng đã chọn file mới
    if (editingFile) {
      formData.append("service_image", editingFile); // Tên field khớp backend
    }
    // Không cần gửi ảnh cũ nếu không đổi

    try {
      // API update thường nhận ID trong URL
      const response = await fetch(`${UPDATE_SERVICE_API}/${editingService.id}`, {
        method: "POST", // Dùng POST vì gửi FormData
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

      if (result.status === 200) {
        alert("Service updated successfully!");
        closeModal();
        fetchServices(); // Tải lại danh sách
      } else {
        throw new Error(result.message || "Failed to update service");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      alert(`Failed to update service: ${error.message}`);
    }
  };

  // --- Xử lý mở/đóng Modal Thêm ---
  const openAddModal = () => {
    // Reset form thêm mới
    setNewService({
      service_title: "",
      service_description: "",
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
    setNewService({
      ...newService,
      [name]: value,
    });
  };

  const handleAddFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFile(file);
      // Tạo preview
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
      alert("Please select an image for the new service.");
      return;
    }
    if (!newService.service_title || !newService.service_description) {
        alert("Please fill in all required fields (Title, Description).");
        return;
    }


    const formData = new FormData();
    formData.append("service_title", newService.service_title);
    formData.append("service_description", newService.service_description);
    formData.append("service_image", newFile); // Tên field khớp backend

    try {
      const response = await fetch(CREATE_SERVICE_API, {
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

      if (result.status === 201) { // Created
        alert("Service created successfully!");
        closeAddModal();
        fetchServices(); // Tải lại danh sách
      } else {
        throw new Error(result.message || "Failed to create service");
      }
    } catch (error) {
      console.error("Error creating service:", error);
      alert(`Failed to create service: ${error.message}`);
    }
  };

  // --- useEffect để fetch dữ liệu lần đầu ---
  useEffect(() => {
    fetchServices();
  }, []);

  // --- JSX ---
  return (
    <div className="manage-destination-container"> {/* Sử dụng class chung */}
      <div className="dem"></div>
      <h1>Manage Homepage Services</h1>

      <button className="add-btn" onClick={openAddModal}>
        Add New Service
      </button>

      {/* --- Bảng hiển thị --- */}
      <div className="table-responsive">
        <table className="destination-table"> {/* Sử dụng class chung */}
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.id}</td>
                <td>
                  <div className="image-preview">
                    {service.fullImagePath ? (
                      <img
                        src={service.fullImagePath}
                        alt={service.service_title}
                        className="destination-image" // Reuse class
                        onError={(e) => { e.target.style.display = 'none'; }} // Ẩn nếu ảnh lỗi
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </div>
                </td>
                <td>{service.service_title}</td>
                <td className="description-cell">{service.service_description}</td>
                <td className="action-column">
                  <button
                    className="modify-btn"
                    onClick={() => handleModifyClick(service)}
                  >
                    Modify
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(service.id)}
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
            <h2>Edit Service</h2>
            <form onSubmit={handleSubmit}>
              {/* Image Preview and Upload */}
              <div className="form-group">
                <label>Service Image:</label>
                {editingImagePreview && (
                  <img src={editingImagePreview} alt="Preview" className="modal-image-preview" />
                )}
                <input
                  type="file"
                  name="service_image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="input-text"
                />
                <small>Leave blank to keep the current image.</small>
              </div>

              {/* Title */}
              <div className="form-group">
                <label>Service Title:</label>
                <input
                  type="text"
                  name="service_title"
                  value={editingService.service_title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter service title"
                  className="input-text"
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Service Description:</label>
                <textarea
                  name="service_description"
                  value={editingService.service_description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Enter service description"
                  className="input-text"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
                <button type="button" className="cancel-btn" onClick={closeModal}>
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
            <h2>Add New Service</h2>
            <form onSubmit={handleAddSubmit}>
              {/* Image Upload */}
              <div className="form-group">
                <label>Service Image:</label>
                {newImagePreview && (
                  <img src={newImagePreview} alt="New Preview" className="modal-image-preview" />
                )}
                <input
                  type="file"
                  name="service_image"
                  accept="image/*"
                  onChange={handleAddFileChange}
                  required // Bắt buộc chọn ảnh khi thêm mới
                  className="input-text"
                />
              </div>

              {/* Title */}
              <div className="form-group">
                <label>Service Title:</label>
                <input
                  type="text"
                  name="service_title"
                  value={newService.service_title}
                  onChange={handleAddInputChange}
                  required
                  placeholder="Enter service title"
                  className="input-text"
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Service Description:</label>
                <textarea
                  name="service_description"
                  value={newService.service_description}
                  onChange={handleAddInputChange}
                  required
                  rows="4"
                  placeholder="Enter service description"
                  className="input-text"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Add Service
                </button>
                <button type="button" className="cancel-btn" onClick={closeAddModal}>
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

export default ManageServices;