import React, { useState, useEffect } from "react";
import {
  GET_CAROUSEL_API,
  CREATE_CAROUSEL_API,
  DELETE_CAROUSEL_API,
  UPDATE_CAROUSEL_API,
  API_URL,
} from "../../api/apis";
import "./AdminHomepage.css";

const ManageImageCarousel = () => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [editingImage, setEditingImage] = useState({
    id: "",
    carousel_image: "",
    carousel_alt: "",
    carousel_caption: "",
  });
  const [editingFile, setEditingFile] = useState(null);
  const [editingImagePreview, setEditingImagePreview] = useState("");

  const [newImage, setNewImage] = useState({
    carousel_alt: "",
    carousel_caption: "",
  });
  const [newFile, setNewFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState("");

  const fetchCarouselImages = async () => {
    try {
      const response = await fetch(GET_CAROUSEL_API);
      const result = await response.json();
      if (result.status === 200 && Array.isArray(result.data)) {
        const imagesWithFullImagePath = result.data.map((img) => ({
          ...img,
          fullImagePath: img.carousel_image
            ? `${API_URL}${img.carousel_image}`
            : null,
        }));
        setCarouselImages(imagesWithFullImagePath);
      } else {
        console.error("Error fetching carousel images:", result.message);
        alert(`Error: ${result.message || "Failed to fetch carousel images"}`);
      }
    } catch (error) {
      console.error("Network error fetching carousel images:", error);
      alert("Network error fetching carousel images.");
    }
  };

  // --- Handle delete ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        const response = await fetch(`${DELETE_CAROUSEL_API}/${id}`, {
          method: "DELETE",
        });
        const result = await response.json();
        if (result.status === 200) {
          alert("Image deleted successfully!");
          fetchCarouselImages();
        } else {
          console.error("Error deleting image:", result.message);
          alert(`Error: ${result.message || "Failed to delete image"}`);
        }
      } catch (error) {
        console.error("Network error deleting image:", error);
        alert("Network error deleting image.");
      }
    }
  };

  // --- Handle Edit Modal ---
  const handleModifyClick = (image) => {
    setEditingImage({
      id: image.id,
      carousel_image: image.carousel_image,
      carousel_alt: image.carousel_alt,
      carousel_caption: image.carousel_caption,
    });
    setEditingImagePreview(image.fullImagePath || "");
    setEditingFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingImagePreview("");
    setEditingFile(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingImage({ ...editingImage, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingFile(file);
      setEditingImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("carousel_alt", editingImage.carousel_alt);
    formData.append("carousel_caption", editingImage.carousel_caption);
    if (editingFile) {
      formData.append("carousel_image", editingFile);
    }

    try {
      const response = await fetch(`${UPDATE_CAROUSEL_API}/${editingImage.id}`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.status === 200) {
        alert("Image updated successfully!");
        closeModal();
        fetchCarouselImages();
      } else {
        console.error("Error updating image:", result.message);
        alert(`Error: ${result.message || "Failed to update image"}`);
      }
    } catch (error) {
      console.error("Network error updating image:", error);
      alert("Network error updating image.");
    }
    };

  const openAddModal = () => {
    setNewImage({ carousel_alt: "", carousel_caption: "" });
    setNewFile(null);
    setNewImagePreview("");
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewImagePreview("");
    setNewFile(null);
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewImage({ ...newImage, [name]: value });
  };

  const handleAddFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFile(file);
      setNewImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newFile) {
      alert("Please select an image file.");
      return;
    }
    const formData = new FormData();
    formData.append("carousel_alt", newImage.carousel_alt);
    formData.append("carousel_caption", newImage.carousel_caption);
    formData.append("carousel_image", newFile);

    try {
      const response = await fetch(CREATE_CAROUSEL_API, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.status === 201) {
        alert("Image added successfully!");
        closeAddModal();
        fetchCarouselImages();
      } else {
        console.error("Error adding image:", result.message);
        alert(`Error: ${result.message || "Failed to add image"}`);
      }
    } catch (error) {
      console.error("Network error adding image:", error);
      alert("Network error adding image.");
    }
  };

  // --- useEffect to fetch data on mount ---
  useEffect(() => {
    fetchCarouselImages();
  }, []);

  // --- JSX ---
  return (
    <div className="manage-destination-container admin-dashboard">
      <div className="dem"></div>
      <h1>Manage Image Carousel</h1>
      <button onClick={openAddModal} className="add-btn">
        Add New Image
      </button>

      <div className="table-responsive">
        <table className="destination-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Alt Text</th>
              <th>Caption</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {carouselImages.map((image) => (
              <tr key={image.id}>
                <td>{image.id}</td>
                <td>
                  {image.fullImagePath ? (
                    <div className="image-preview">
                      <img
                        src={image.fullImagePath}
                        alt={image.carousel_alt}
                        className="destination-image"
                      />
                    </div>
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{image.carousel_alt}</td>
                <td className="description-cell">{image.carousel_caption}</td>
                <td className="action-column">
                  <button
                    onClick={() => handleModifyClick(image)}
                    className="modify-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Carousel Image</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="carousel_alt">Alt Text</label>
                <input
                  type="text"
                  id="carousel_alt"
                  name="carousel_alt"
                  value={editingImage.carousel_alt}
                  onChange={handleInputChange}
                  required
                  className="input-text"
                />
              </div>
              <div className="form-group">
                <label htmlFor="carousel_caption">Caption</label>
                <textarea
                  id="carousel_caption"
                  name="carousel_caption"
                  value={editingImage.carousel_caption}
                  onChange={handleInputChange}
                  required
                  className="input-text"
                />
              </div>
              <div className="form-group">
                <label htmlFor="carousel_image_edit">Image</label>
                <input
                  type="file"
                  id="carousel_image_edit"
                  name="carousel_image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="input-text"
                />
                {editingImagePreview && (
                  <div className="image-preview" style={{ marginTop: "10px", width: "100px", height: "auto" }}>
                    <img src={editingImagePreview} alt="Preview" style={{ width: "100%" }} />
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
                <button type="button" onClick={closeModal} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Carousel Image</h2>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label htmlFor="carousel_alt_add">Alt Text</label>
                <input
                  type="text"
                  id="carousel_alt_add"
                  name="carousel_alt"
                  value={newImage.carousel_alt}
                  onChange={handleAddInputChange}
                  required
                  className="input-text"
                />
              </div>
              <div className="form-group">
                <label htmlFor="carousel_caption_add">Caption</label>
                <textarea
                  id="carousel_caption_add"
                  name="carousel_caption"
                  value={newImage.carousel_caption}
                  onChange={handleAddInputChange}
                  required
                  className="input-text"
                />
              </div>
              <div className="form-group">
                <label htmlFor="carousel_image_add">Image</label>
                <input
                  type="file"
                  id="carousel_image_add"
                  name="carousel_image"
                  accept="image/*"
                  onChange={handleAddFileChange}
                  required
                  className="input-text"
                />
                {newImagePreview && (
                  <div className="image-preview" style={{ marginTop: "10px", width: "100px", height: "auto" }}>
                    <img src={newImagePreview} alt="Preview" style={{ width: "100%" }} />
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Add Image
                </button>
                <button type="button" onClick={closeAddModal} className="cancel-btn">
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

export default ManageImageCarousel;