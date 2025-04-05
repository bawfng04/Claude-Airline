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

  useEffect(() => {
    fetchTopDestinations();
  }, []);

  return (
    <div className="manage-destination-container">
      <div className="dem"></div>
      <h1>Manage Top Destinations</h1>
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
                  <button className="modify-btn">Modify</button>
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
    </div>
  );
};

export default ManageTopDestination;
