// filepath: d:\Projects\LTWebAssignment\LTWeb-Assignment\frontend\src\pages\admin\ManageTravelPackage.js
import React, { useState, useEffect } from "react";
import {
  GET_TRAVEL_PACKAGES_API,
  CREATE_TRAVEL_PACKAGE_API,
  DELETE_TRAVEL_PACKAGE_API,
  UPDATE_TRAVEL_PACKAGE_API,
  API_URL,
} from "../../bang_config/apis";

const ManageTravelPackage = () => {
  const [travelPackages, setTravelPackages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // State cho form sửa
  const [editingPackage, setEditingPackage] = useState({
    id: "",
    package_image: "", // URL ảnh hiện tại
    package_name: "",
    package_description: "",
  });
  const [editingFile, setEditingFile] = useState(null);
  const [editingImagePreview, setEditingImagePreview] = useState("");

  // State cho form thêm mới
  const [newPackage, setNewPackage] = useState({
    package_name: "",
    package_description: "",
  });
  const [newFile, setNewFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState("");

  // --- Hàm fetch dữ liệu ---
  const fetchTravelPackages = async () => {
    try {
      const response = await fetch(GET_TRAVEL_PACKAGES_API);
      const result = await response.json();
        if (result.status === 200 && Array.isArray(result.data)) {
          //
        const packagesWithFullImagePath = result.data.map((pkg) => ({
          ...pkg,
          fullImagePath: pkg.package_image
            ? `${API_URL}${pkg.package_image}` // Ghép URL đầy đủ
            : null,
        }));
        setTravelPackages(packagesWithFullImagePath);
      } else {
        console.error("Error fetching packages:", result.message);
        alert(`Error: ${result.message || "Failed to fetch packages"}`);
      }
    } catch (error) {
      console.error("Error fetching travel packages:", error);
      alert("Failed to fetch packages. Please check the console.");
    }
  };

  // --- Hàm xử lý xóa ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) {
      return;
    }
    try {
      // Sử dụng query parameter cho DELETE
      const response = await fetch(`${DELETE_TRAVEL_PACKAGE_API}?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        try {
          const result = await response.json();
          if (result.status === 200) {
            alert("Travel package deleted successfully!");
            fetchTravelPackages(); // Tải lại danh sách
          } else {
            throw new Error(result.message || "Failed to delete package");
          }
        } catch (jsonError) {
          console.log(
            "Package deleted (non-JSON response). Status:",
            response.status
          );
          alert("Travel package deleted successfully!");
          fetchTravelPackages();
        }
      } else {
        const errorData = await response.text();
        console.error("Delete failed:", errorData);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData}`
        );
      }
    } catch (error) {
      console.error("Error deleting travel package:", error);
      alert(`Failed to delete package. ${error.message}`);
    }
  };

  // --- Xử lý cho Modal Sửa ---
  const handleModifyClick = (pkg) => {
    setEditingPackage({
      id: pkg.id,
      package_image: pkg.package_image, // Lưu đường dẫn tương đối gốc
      package_name: pkg.package_name,
      package_description: pkg.package_description,
    });
    setEditingImagePreview(pkg.fullImagePath || ""); // Preview dùng full path
    setEditingFile(null);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingPackage({
      ...editingPackage,
      [name]: value,
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
      // Quay lại ảnh gốc nếu hủy chọn file
      const originalPkg = travelPackages.find(
        (p) => p.id === editingPackage.id
      );
      setEditingImagePreview(originalPkg?.fullImagePath || "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("id", editingPackage.id);
    formData.append("package_name", editingPackage.package_name);
    formData.append("package_description", editingPackage.package_description);

    if (editingFile) {
      formData.append("package_image", editingFile); // Tên field khớp backend
    }
    // Không cần gửi ảnh cũ nếu không đổi

    try {
      const response = await fetch(
        `${UPDATE_TRAVEL_PACKAGE_API}/${editingPackage.id}`,
        {
          method: "POST", // Dùng POST cho FormData
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
        alert("Package updated successfully!");
        closeModal();
        fetchTravelPackages();
      } else {
        throw new Error(result.message || "Failed to update package");
      }
    } catch (error) {
      console.error("Error updating package:", error);
      alert(`Failed to update package: ${error.message}`);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingImagePreview("");
    setEditingFile(null);
  };

  // --- Xử lý cho Modal Thêm Mới ---
  const openAddModal = () => {
    setNewPackage({ package_name: "", package_description: "" });
    setNewFile(null);
    setNewImagePreview("");
    setIsAddModalOpen(true);
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewPackage({ ...newPackage, [name]: value });
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

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newFile) {
      alert("Please select an image for the new package.");
      return;
    }

    const formData = new FormData();
    formData.append("package_name", newPackage.package_name);
    formData.append("package_description", newPackage.package_description);
    formData.append("package_image", newFile); // Tên field khớp backend

    try {
      const response = await fetch(CREATE_TRAVEL_PACKAGE_API, {
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
        alert("Package created successfully!");
        closeAddModal();
        fetchTravelPackages();
      } else {
        throw new Error(result.message || "Failed to create package");
      }
    } catch (error) {
      console.error("Error creating package:", error);
      alert(`Failed to create package: ${error.message}`);
    }
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewImagePreview("");
    setNewFile(null);
  };

  // --- useEffect để fetch dữ liệu lần đầu ---
  useEffect(() => {
    fetchTravelPackages();
  }, []);

  // --- JSX ---
  return (
    // Sử dụng class tương tự ManageTopDestination hoặc tạo class riêng
    <div className="manage-destination-container">
      <div className="dem"></div>
      <h1>Manage Travel Packages</h1>

      <button className="add-btn" onClick={openAddModal}>
        Add New Package
      </button>

      {/* --- Bảng hiển thị --- */}
      <div className="table-responsive">
        {/* Đổi class table nếu cần */}
        <table className="destination-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Image</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {travelPackages.map((pkg) => (
              <tr key={pkg.id}>
                <td>{pkg.id}</td>
                <td>{pkg.package_name}</td>
                <td>
                  <div className="image-preview">
                    {pkg.fullImagePath ? (
                      <img
                        src={pkg.fullImagePath}
                        alt={pkg.package_name}
                        className="destination-image" // Giữ class hoặc đổi
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </div>
                </td>
                {/* Có thể cần class riêng cho description nếu dài */}
                <td className="description-cell">{pkg.package_description}</td>
                <td className="action-column">
                  <button
                    className="modify-btn"
                    onClick={() => handleModifyClick(pkg)}
                  >
                    Modify
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(pkg.id)}
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
            <h2>Edit Travel Package</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Image:</label>
                {editingImagePreview && (
                  <img
                    src={editingImagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  />
                )}
                <input
                  type="file"
                  name="package_image_file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="input-text"
                />
                <small>Leave blank to keep the current image.</small>
              </div>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="package_name"
                  value={editingPackage.package_name}
                  onChange={handleInputChange}
                  required
                  className="input-text"
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="package_description"
                  value={editingPackage.package_description}
                  onChange={handleInputChange}
                  required
                  className="input-text"
                />
              </div>
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
            <h2>Add New Travel Package</h2>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label>Image:</label>
                {newImagePreview && (
                  <img
                    src={newImagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  />
                )}
                <input
                  type="file"
                  name="package_image_file"
                  accept="image/*"
                  onChange={handleAddFileChange}
                  required // Ảnh là bắt buộc khi thêm mới
                  className="input-text"
                />
              </div>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="package_name"
                  value={newPackage.package_name}
                  onChange={handleAddInputChange}
                  required
                  placeholder="e.g., Summer Vacation"
                  className="input-text"
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="package_description"
                  value={newPackage.package_description}
                  onChange={handleAddInputChange}
                  required
                  placeholder="e.g., A wonderful trip to the beach..."
                  className="input-text"
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Add Package
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

export default ManageTravelPackage;
