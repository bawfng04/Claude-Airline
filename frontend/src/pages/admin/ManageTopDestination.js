import React, { useState, useEffect } from "react";
import {
  GET_TOP_DESTINATION_API,
  CREATE_TOP_DESTINATION_API,
  DELETE_TOP_DESTINATION_API,
  UPDATE_TOP_DESTINATION_API,
  API_URL,
} from "../../bang_config/apis";
import "./AdminHomepage.css";

const ManageTopDestination = () => {
  const [topDestinations, setTopDestinations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // State cho form sửa
  const [editingDestination, setEditingDestination] = useState({
    id: "",
    destination_image: "",
    destination_name: "",
    destination_country: "",
    destination_price: "",
    destination_description: "",
    destination_begin: "",
    destination_end: "",
    destination_offer: "",
    destination_category: "",
  });
  const [editingFile, setEditingFile] = useState(null); // State lưu file đang sửa
  const [editingImagePreview, setEditingImagePreview] = useState(""); // State cho preview ảnh sửa

  // State cho form thêm mới
  const [newDestination, setNewDestination] = useState({
    // destination_image: "",
    destination_name: "",
    destination_country: "",
    destination_price: "",
    destination_description: "",
    destination_begin: "",
    destination_end: "",
    destination_offer: "",
    destination_category: "",
  });
  const [newFile, setNewFile] = useState(null); // State lưu file mới
  const [newImagePreview, setNewImagePreview] = useState(""); // State cho preview ảnh mới

  // --- Hàm fetch dữ liệu ---
  const fetchTopDestinations = async () => {
    try {
      // Sử dụng API_BASE_URL đã được cấu hình trong axios hoặc định nghĩa riêng
      const response = await fetch(GET_TOP_DESTINATION_API);
      const result = await response.json();
      if (result.status === 200) {
        const destinationsWithFullImagePath = result.data.map((dest) => ({
          ...dest,
          // Giả sử API_BASE_URL là http://localhost/backend/public
          // và destination_image là /uploads/destinations/abc.jpg
          // thì fullImagePath sẽ là http://localhost/backend/public/uploads/destinations/abc.jpg
          fullImagePath: dest.destination_image
            ? `${API_URL}${dest.destination_image}`
            : null,
        }));
        setTopDestinations(destinationsWithFullImagePath);
      } else {
        console.error("Error fetching destinations:", result.message);
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error fetching top destinations:", error);
      alert("Failed to fetch destinations. Please check the console.");
    }
  };

  // --- Hàm xử lý xóa ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) {
      return;
    }
    try {
      const response = await fetch(`${DELETE_TOP_DESTINATION_API}?id=${id}`, {
        method: "DELETE",
      });

      // Xử lý response từ backend (có thể trả về JSON hoặc chỉ status)
      if (response.ok) {
        // Nếu backend trả về JSON
        try {
          const result = await response.json();
          if (result.status === 200) {
            alert("Top destination deleted successfully!");
            fetchTopDestinations(); // Tải lại danh sách
          } else {
            throw new Error(result.message || "Failed to delete destination");
          }
        } catch (jsonError) {
          // Nếu backend không trả về JSON nhưng status là OK (ví dụ 204 No Content)
          console.log(
            "Destination deleted (non-JSON response). Status:",
            response.status
          );
          alert("Top destination deleted successfully!");
          fetchTopDestinations(); // Tải lại danh sách
        }
      } else {
        // Xử lý lỗi HTTP
        const errorData = await response.text(); // Đọc lỗi dưới dạng text
        console.error("Delete failed:", errorData);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData}`
        );
      }
    } catch (error) {
      console.error("Error deleting top destination:", error);
      alert(`Failed to delete destination. ${error.message}`);
    }
  };

  // --- Xử lý cho Modal Sửa ---
  const handleModifyClick = (destination) => {
    setEditingDestination({
      ...destination, // Bao gồm cả id và fullImagePath
      // Lấy ngày tháng đúng định dạng YYYY-MM-DD cho input type="date"
      destination_begin: destination.destination_begin
        ? destination.destination_begin.split(" ")[0]
        : "",
      destination_end: destination.destination_end
        ? destination.destination_end.split(" ")[0]
        : "",
    });
    setEditingImagePreview(destination.fullImagePath || ""); // Đặt preview là ảnh hiện tại
    setEditingFile(null); // Reset file đã chọn
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingDestination({
      ...editingDestination,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingFile(file);
      // Tạo preview cho ảnh mới chọn
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // Nếu người dùng hủy chọn file, quay lại ảnh gốc (nếu có)
      setEditingFile(null);
      setEditingImagePreview(editingDestination.fullImagePath || "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append các trường dữ liệu vào FormData
    formData.append("id", editingDestination.id); // Gửi cả ID để backend biết là update
    formData.append("destination_name", editingDestination.destination_name);
    formData.append(
      "destination_country",
      editingDestination.destination_country
    );
    formData.append("destination_price", editingDestination.destination_price);
    formData.append(
      "destination_description",
      editingDestination.destination_description
    );
    formData.append("destination_begin", editingDestination.destination_begin);
    formData.append("destination_end", editingDestination.destination_end);
    formData.append("destination_offer", editingDestination.destination_offer);
    formData.append(
      "destination_category",
      editingDestination.destination_category
    );

    // Chỉ append file nếu người dùng đã chọn file mới
    if (editingFile) {
      formData.append("destination_image", editingFile); // Tên field phải khớp với backend $_FILES['destination_image']
    }
    // Không cần gửi destination_image cũ nếu không đổi ảnh, backend sẽ tự xử lý

    try {
      const response = await fetch(
        `${UPDATE_TOP_DESTINATION_API}/${editingDestination.id}`, // URL endpoint update
        {
          method: "POST", // Sử dụng POST để gửi FormData (một số server cấu hình PUT không nhận FormData tốt)
          body: formData,
          // Không cần set 'Content-Type': 'multipart/form-data', trình duyệt sẽ tự làm khi body là FormData
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => response.text()); // Cố gắng parse JSON, nếu lỗi thì lấy text
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
        alert("Destination updated successfully!");
        closeModal();
        fetchTopDestinations(); // Tải lại danh sách
      } else {
        throw new Error(result.message || "Failed to update destination");
      }
    } catch (error) {
      console.error("Error updating destination:", error);
      alert(`Failed to update destination: ${error.message}`);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingImagePreview(""); // Reset preview khi đóng modal
    setEditingFile(null);
  };

  // --- Xử lý cho Modal Thêm Mới ---
  const openAddModal = () => {
    // Reset form thêm mới
    setNewDestination({
      destination_name: "",
      destination_country: "",
      destination_price: "",
      destination_description: "",
      destination_begin: "",
      destination_end: "",
      destination_offer: "",
      destination_category: "",
    });
    setNewFile(null);
    setNewImagePreview("");
    setIsAddModalOpen(true);
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewDestination({
      ...newDestination,
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

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!newFile) {
      alert("Please select an image for the new destination.");
      return;
    }

    const formData = new FormData();
    formData.append("destination_name", newDestination.destination_name);
    formData.append("destination_country", newDestination.destination_country);
    formData.append("destination_price", newDestination.destination_price);
    formData.append(
      "destination_description",
      newDestination.destination_description
    );
    formData.append("destination_begin", newDestination.destination_begin);
    formData.append("destination_end", newDestination.destination_end);
    formData.append("destination_offer", newDestination.destination_offer);
    formData.append(
      "destination_category",
      newDestination.destination_category
    );
    formData.append("destination_image", newFile); // Gửi file mới

    try {
      const response = await fetch(CREATE_TOP_DESTINATION_API, {
        method: "POST",
        body: formData,
        // Không cần 'Content-Type'
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

      // Backend trả về 201 Created khi thành công
      if (result.status === 201) {
        alert("Destination created successfully!");
        closeAddModal();
        fetchTopDestinations(); // Tải lại danh sách
      } else {
        throw new Error(result.message || "Failed to create destination");
      }
    } catch (error) {
      console.error("Error creating destination:", error);
      alert(`Failed to create destination: ${error.message}`);
    }
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewImagePreview(""); // Reset preview khi đóng
    setNewFile(null);
  };

  // --- useEffect để fetch dữ liệu lần đầu ---
  useEffect(() => {
    fetchTopDestinations();
  }, []);

  // --- JSX ---
  return (
    <div className="manage-destination-container">
      <div className="dem"></div>
      <h1>Manage Top Destinations</h1>

      <button className="add-btn" onClick={openAddModal}>
        Add New Destination
      </button>

      {/* --- Bảng hiển thị --- */}
      <div className="table-responsive">
        <table className="destination-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Image</th>
              <th>Country</th>
              <th>Price</th>
              <th>Description</th>
              <th>Begin Date</th>
              <th>End Date</th>
              <th>Offer</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {topDestinations.map((destination) => (
              <tr key={destination.id}>
                <td>{destination.id}</td>
                <td>{destination.destination_name}</td>
                <td>
                  <div className="image-preview">
                    {/* Sử dụng fullImagePath đã có base URL */}
                    {destination.fullImagePath ? (
                      <img
                        src={destination.fullImagePath}
                        alt={destination.destination_name}
                        className="destination-image"
                        onError={(e) => {
                          e.target.style.display = "none"; /* Ẩn nếu ảnh lỗi */
                        }}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </div>
                </td>
                <td>{destination.destination_country}</td>
                <td>${destination.destination_price}</td>
                <td className="description-cell">
                  {destination.destination_description}
                </td>
                <td>
                  {destination.destination_begin
                    ? destination.destination_begin.split(" ")[0]
                    : ""}
                </td>
                <td>
                  {destination.destination_end
                    ? destination.destination_end.split(" ")[0]
                    : ""}
                </td>
                <td>{destination.destination_offer}</td>
                <td>{destination.destination_category}</td>
                <td className="action-column">
                  <button
                    className="modify-btn"
                    onClick={() => handleModifyClick(destination)}
                  >
                    Modify
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(destination.id)}
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
            <h2>Edit Destination</h2>
            <form onSubmit={handleSubmit}>
              {/* Input File và Preview */}
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
                  name="destination_image_file" // Đổi name để không trùng state
                  accept="image/png, image/jpeg, image/gif, image/webp" // Giới hạn loại file
                  onChange={handleFileChange}
                  className="input-text"
                />
                <small>Leave blank to keep the current image.</small>
              </div>

              {/* Các input khác giữ nguyên */}
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="destination_name"
                  value={editingDestination.destination_name}
                  onChange={handleInputChange}
                  required
                  className="input-text"
                />
              </div>
              <div className="form-group">
                <label>Country:</label>
                <input
                  type="text"
                  name="destination_country"
                  value={editingDestination.destination_country}
                  onChange={handleInputChange}
                  required
                  className="input-text"
                />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  name="destination_price"
                  value={editingDestination.destination_price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                  className="input-text"
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="destination_description"
                  value={editingDestination.destination_description}
                  onChange={handleInputChange}
                  required
                  className="input-text"
                />
              </div>
              <div className="form-group">
                <label>Begin Date:</label>
                <input
                  type="date"
                  name="destination_begin"
                  value={editingDestination.destination_begin}
                  onChange={handleInputChange}
                  required
                  className="input-text"
                />
              </div>
              <div className="form-group">
                <label>End Date:</label>
                <input
                  type="date"
                  name="destination_end"
                  value={editingDestination.destination_end}
                  onChange={handleInputChange}
                  required
                  className="input-text"
                />
              </div>
              <div className="form-group">
                <label>Offer:</label>
                <input
                  type="text"
                  name="destination_offer"
                  value={editingDestination.destination_offer}
                  onChange={handleInputChange}
                  required
                  className="input-text"
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <input
                  type="text"
                  name="destination_category"
                  value={editingDestination.destination_category}
                  onChange={handleInputChange}
                  required
                  className="input-text"
                />
              </div>

              {/* Nút bấm */}
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
            <h2>Add New Destination</h2>
            <form onSubmit={handleAddSubmit}>
              {/* Input File và Preview */}
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
                  name="destination_image_file" // Đổi name
                  accept="image/png, image/jpeg, image/gif, image/webp"
                  onChange={handleAddFileChange}
                  required // Bắt buộc chọn ảnh khi thêm mới
                  className="input-text"
                />
              </div>

              {/* Các input khác */}
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="destination_name"
                  value={newDestination.destination_name}
                  onChange={handleAddInputChange}
                  required
                  className="input-text"
                  placeholder="Paris"
                />
              </div>
              <div className="form-group">
                <label>Country:</label>
                <input
                  type="text"
                  name="destination_country"
                  value={newDestination.destination_country}
                  onChange={handleAddInputChange}
                  required
                  placeholder="France"
                  className="input-text"
                />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  name="destination_price"
                  value={newDestination.destination_price}
                  onChange={handleAddInputChange}
                  step="0.01"
                  min="0"
                  required
                  className="input-text"
                  placeholder="499.99"
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="destination_description"
                  value={newDestination.destination_description}
                  onChange={handleAddInputChange}
                  required
                  placeholder="Explore the city of lights..."
                  className="input-text"
                />
              </div>
              <div className="form-group">
                <label>Begin Date:</label>
                <input
                  type="date"
                  name="destination_begin"
                  value={newDestination.destination_begin}
                  onChange={handleAddInputChange}
                  className="input-text"
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date:</label>
                <input
                  type="date"
                  name="destination_end"
                  value={newDestination.destination_end}
                  onChange={handleAddInputChange}
                  className="input-text"
                  required
                />
              </div>
              <div className="form-group">
                <label>Offer:</label>
                <input
                  type="text"
                  name="destination_offer"
                  value={newDestination.destination_offer}
                  onChange={handleAddInputChange}
                  required
                  className="input-text"
                  placeholder="20% off for early bookings!"
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <input
                  type="text"
                  name="destination_category"
                  value={newDestination.destination_category}
                  onChange={handleAddInputChange}
                  className="input-text"
                  required
                  placeholder="Europe"
                />
              </div>

              {/* Nút bấm */}
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Add Destination
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

export default ManageTopDestination;
