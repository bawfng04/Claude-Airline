import React from "react";
import { useState, useEffect } from "react";

const api = "http://localhost/backend/public/TopDestination/index";

const ManageTopDestination = () => {
  const [topDestinations, setTopDestinations] = useState([]);

  // fetch data
  const fetchTopDestinations = async () => {
    try {
      const response = await fetch(api);
      const result = await response.json();
      if (result.status === 200) {
        setTopDestinations(result.data); // Backend trả về {status, message, data}
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error fetching top destinations:", error);
    }
  };

  useEffect(() => {
    fetchTopDestinations();
  }, []);

  return (
    <div className="admin-homepage">
      <div className="dem"></div>
      <div>data: {JSON.stringify(topDestinations)}</div>

      <h1>Manage Top Destinations</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Destination Name</th>
            <th>Image URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {topDestinations.map((destination) => (
            <tr key={destination.id}>
              <td>{destination.id}</td>
              <td>{destination.destination_name}</td>
              <td>{destination.destination_image}</td>
              <td>{destination.destination_country}</td>
              <td>{destination.destination_price}</td>
              <td>{destination.destination_description}</td>
              <td>{destination.destination_begin}</td>
              <td>{destination.destination_end}</td>
              <td>{destination.destination_offer}</td>
              <td>{destination.destination_category}</td>
              <td>
                <button className="btn btn-danger">Modify</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageTopDestination;
