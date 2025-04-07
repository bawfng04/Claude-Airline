import React, { useState, useEffect } from "react";
import {
  GET_TOP_DESTINATION_API,
  CREATE_TOP_DESTINATION_API,
  DELETE_TOP_DESTINATION_API,
  UPDATE_TOP_DESTINATION_API,
} from "../../bang_config/apis";
import "./AdminHomepage.css";

const ManageTopDestination = () => {
  const [topDestinations, setTopDestinations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
  const [newDestination, setNewDestination] = useState({
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

  // lấy hết top destination
  const fetchTopDestinations = async () => {
    try {
      const response = await fetch(GET_TOP_DESTINATION_API);
      const result = await response.json();
      if (result.status === 200) {
        setTopDestinations(result.data);
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error fetching top destinations:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (
        !window.confirm("Are you sure you want to delete this destination?")
      ) {
        return;
      }

      const response = await fetch(`${DELETE_TOP_DESTINATION_API}?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      //   bug
      if (!response.ok && response.status === 404) {
        alert("Destination deleted successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);

        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 200) {
        setTopDestinations((prevDestinations) =>
          prevDestinations.filter((destination) => destination.id !== id)
        );
        alert("Top destination deleted successfully!");
      } else {
        throw new Error(result.message || "Failed to delete destination");
      }
    } catch (error) {
      console.error("Error deleting top destination:", error);
      alert(
        `Failed to delete destination ${id}. Please try again. Error: ${error.message}`
      );
    }
  };

  const handleModifyClick = (destination) => {
    setEditingDestination({
      ...destination,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingDestination({
      ...editingDestination,
      [name]: value,
    });
  };

  // Handle input change in add form
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewDestination({
      ...newDestination,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the dates properly for PHP's consumption
      const formattedDestination = {
        ...editingDestination,
        destination_price: parseFloat(editingDestination.destination_price),
        // Make sure dates are in YYYY-MM-DD format
        destination_begin: new Date(editingDestination.destination_begin)
          .toISOString()
          .split("T")[0],
        destination_end: new Date(editingDestination.destination_end)
          .toISOString()
          .split("T")[0],
      };

      // Log the data being sent to help debug
      console.log("Sending data:", formattedDestination);

      const response = await fetch(
        `${UPDATE_TOP_DESTINATION_API}/${editingDestination.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedDestination),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${JSON.stringify(
            errorData
          )}`
        );
      }

      const result = await response.json();

      if (result.status === 200) {
        alert("Destination updated successfully!");
        setIsModalOpen(false);
        // Refresh the destinations list
        fetchTopDestinations();
      } else {
        throw new Error(result.message || "Failed to update destination");
      }
    } catch (error) {
      console.error("Error updating destination:", error);
      alert(`Failed to update destination: ${error.message}`);
    }
  };

  // Handle add form submission
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the dates properly for PHP's consumption
      const formattedDestination = {
        ...newDestination,
        destination_price: parseFloat(newDestination.destination_price),
        // Make sure dates are in YYYY-MM-DD format
        destination_begin: new Date(newDestination.destination_begin)
          .toISOString()
          .split("T")[0],
        destination_end: new Date(newDestination.destination_end)
          .toISOString()
          .split("T")[0],
      };

      console.log("Sending new destination data:", formattedDestination);

      const response = await fetch(CREATE_TOP_DESTINATION_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedDestination),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${JSON.stringify(
            errorData
          )}`
        );
      }

      const result = await response.json();

      if (result.status === 201) {
        alert("Destination created successfully!");
        setIsAddModalOpen(false);
        // Reset form
        setNewDestination({
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
        // Refresh the destinations list
        fetchTopDestinations();
      } else {
        throw new Error(result.message || "Failed to create destination");
      }
    } catch (error) {
      console.error("Error creating destination:", error);
      alert(`Failed to create destination: ${error.message}`);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Close add modal
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Open add modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  useEffect(() => {
    fetchTopDestinations();
  }, []);

  return (
    <div className="manage-destination-container">
      <div className="dem"></div>
      <h1>Manage Top Destinations</h1>

      <button className="add-btn" onClick={openAddModal}>
        Add New Destination
      </button>

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
                    <img
                      src={destination.destination_image}
                      alt={destination.destination_name}
                      className="destination-image"
                    />
                  </div>
                </td>
                <td>{destination.destination_country}</td>
                <td>${destination.destination_price}</td>
                <td className="description-cell">
                  {destination.destination_description}
                </td>
                <td>{destination.destination_begin}</td>
                <td>{destination.destination_end}</td>
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

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Destination</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Image URL:</label>
                <input
                  type="text"
                  name="destination_image"
                  value={editingDestination.destination_image}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="destination_name"
                  value={editingDestination.destination_name}
                  onChange={handleInputChange}
                  required
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
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="destination_description"
                  value={editingDestination.destination_description}
                  onChange={handleInputChange}
                  required
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

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Destination</h2>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label>Image URL:</label>
                <input
                  type="text"
                  name="destination_image"
                  value={newDestination.destination_image}
                  onChange={handleAddInputChange}
                  required
                  placeholder="image.jpg"
                />
              </div>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="destination_name"
                  value={newDestination.destination_name}
                  onChange={handleAddInputChange}
                  required
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
                />
              </div>
              <div className="form-group">
                <label>Begin Date:</label>
                <input
                  type="date"
                  name="destination_begin"
                  value={newDestination.destination_begin}
                  onChange={handleAddInputChange}
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
                  required
                  placeholder="Europe"
                />
              </div>
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
