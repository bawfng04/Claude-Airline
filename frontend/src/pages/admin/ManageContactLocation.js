import React, { useState, useEffect } from "react";
import {
  GET_CONTACT_LOCATIONS_API,
  CREATE_CONTACT_LOCATION_API,
  DELETE_CONTACT_LOCATION_API,
  UPDATE_CONTACT_LOCATION_API,
} from "../../bang_config/apis";
import "./AdminHomepage.css";

const ManageContactLocation = () => {
  const [locations, setLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState({
    id: "",
    location_name: "",
    des_type: "",
    address_string: "",
    phone_number: "",
    working_hours: "",
    email: "",
    location_embed_code: "",
  });
  const [newLocation, setNewLocation] = useState({
    location_name: "",
    des_type: "",
    address_string: "",
    phone_number: "",
    working_hours: "",
    email: "",
    location_embed_code: "",
  });

  // Fetch all contact locations
  const fetchContactLocations = async () => {
    try {
      const response = await fetch(GET_CONTACT_LOCATIONS_API);
      const result = await response.json();
      if (result.status === 200) {
        setLocations(result.data);
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error fetching contact locations:", error);
    }
  };

  // Handle location deletion
  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete this location?")) {
        return;
      }

      const response = await fetch(`${DELETE_CONTACT_LOCATION_API}?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 200) {
        setLocations(locations.filter((location) => location.id !== id));
        alert("Location deleted successfully!");
      } else {
        throw new Error(result.message || "Failed to delete location");
      }
    } catch (error) {
      console.error("Error deleting location:", error);
      alert(
        `Failed to delete location ${id}. Please try again. Error: ${error.message}`
      );
    }
  };

  // Handle edit button click
  const handleModifyClick = (location) => {
    setEditingLocation({
      ...location,
    });
    setIsModalOpen(true);
  };

  // Handle input change in edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingLocation({
      ...editingLocation,
      [name]: value,
    });
  };

  // Handle input change in add form
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewLocation({
      ...newLocation,
      [name]: value,
    });
  };

  // Handle update form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending update data:", editingLocation);

      const response = await fetch(
        `${UPDATE_CONTACT_LOCATION_API}/${editingLocation.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingLocation),
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
        alert("Location updated successfully!");
        setIsModalOpen(false);
        // Refresh the locations list
        fetchContactLocations();
      } else {
        throw new Error(result.message || "Failed to update location");
      }
    } catch (error) {
      console.error("Error updating location:", error);
      alert(`Failed to update location: ${error.message}`);
    }
  };

  // Handle add form submission
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending new location data:", newLocation);

      const response = await fetch(CREATE_CONTACT_LOCATION_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLocation),
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
        alert("Location created successfully!");
        setIsAddModalOpen(false);
        // Reset form
        setNewLocation({
          des_type: "",
          address_string: "",
          phone_number: "",
          working_hours: "",
        });
        // Refresh the locations list
        fetchContactLocations();
      } else {
        throw new Error(result.message || "Failed to create location");
      }
    } catch (error) {
      console.error("Error creating location:", error);
      alert(`Failed to create location: ${error.message}`);
    }
  };

  // Close edit modal
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
    fetchContactLocations();
  }, []);

  return (
    <div className="manage-destination-container">
      <div className="dem"></div>
      <h1>Manage Contact Locations</h1>

      <button className="add-btn" onClick={openAddModal}>
        Add New Location
      </button>

      <div className="table-responsive">
        <table className="destination-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Hours</th>
              <th>Email</th>
              <th>Embed Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr key={location.id}>
                <td>{location.id}</td>
                <td>{location.location_name}</td>
                <td>{location.des_type}</td>
                <td>{location.address_string}</td>
                <td>{location.phone_number}</td>
                <td>{location.working_hours}</td>
                <td>{location.email}</td>
                <td>{location.location_embed_code}</td>
                <td className="action-column">
                  <button
                    className="modify-btn"
                    onClick={() => handleModifyClick(location)}
                  >
                    Modify
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(location.id)}
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
            <h2>Edit Location</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Location Name:</label>
                <input
                  type="text"
                  name="location_name"
                  value={editingLocation.location_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Location name"
                />
              </div>
              <div className="form-group">
                <label>Location Type:</label>
                <input
                  type="text"
                  name="des_type"
                  value={editingLocation.des_type}
                  onChange={handleInputChange}
                  required
                  placeholder="Main Office, Branch Office, etc."
                />
              </div>
              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  name="address_string"
                  value={editingLocation.address_string}
                  onChange={handleInputChange}
                  required
                  placeholder="Full address"
                />
              </div>
              <div className="form-group">
                <label>Phone Number:</label>
                <input
                  type="text"
                  name="phone_number"
                  value={editingLocation.phone_number}
                  onChange={handleInputChange}
                  required
                  placeholder="+xx xx xxxx xxxx"
                />
              </div>
              <div className="form-group">
                <label>Working Hours:</label>
                <input
                  type="text"
                  name="working_hours"
                  value={editingLocation.working_hours}
                  onChange={handleInputChange}
                  required
                  placeholder="Mon-Fri 9am-5pm"
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editingLocation.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Email address"
                />
              </div>
              <div className="form-group">
                <label>Location Embed Code:</label>
                <input
                  type="text"
                  name="location_embed_code"
                  value={editingLocation.location_embed_code}
                  onChange={handleInputChange}
                  required
                  placeholder="Google Maps embed code for map"
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
            <h2>Add New Location</h2>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label>Location Name:</label>
                <input
                  type="text"
                  name="location_name"
                  value={newLocation.location_name}
                  onChange={handleAddInputChange}
                  required
                  placeholder="Location name"
                />
              </div>
              <div className="form-group">
                <label>Location Type:</label>
                <input
                  type="text"
                  name="des_type"
                  value={newLocation.des_type}
                  onChange={handleAddInputChange}
                  required
                  placeholder="Main Office, Branch Office, etc."
                />
              </div>
              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  name="address_string"
                  value={newLocation.address_string}
                  onChange={handleAddInputChange}
                  required
                  placeholder="Full address"
                />
              </div>
              <div className="form-group">
                <label>Phone Number:</label>
                <input
                  type="text"
                  name="phone_number"
                  value={newLocation.phone_number}
                  onChange={handleAddInputChange}
                  required
                  placeholder="+xx xx xxxx xxxx"
                />
              </div>
              <div className="form-group">
                <label>Working Hours:</label>
                <input
                  type="text"
                  name="working_hours"
                  value={newLocation.working_hours}
                  onChange={handleAddInputChange}
                  required
                  placeholder="Mon-Fri 9am-5pm"
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={newLocation.email}
                  onChange={handleAddInputChange}
                  required
                  placeholder="exampleemail@gmail.com"
                />
              </div>
              <div className="form-group">
                <label>Location Embed Code:</label>
                <input
                  type="text"
                  name="location_embed_code"
                  value={newLocation.location_embed_code}
                  onChange={handleAddInputChange}
                  required
                  placeholder="Embed code for map"
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Add Location
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

export default ManageContactLocation;
