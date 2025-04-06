import React from "react";

const Admin = () => {
  return (
    <div>
      <div className="dem"></div>
      <div className="admin-manage-container">
        <h1 className="admin-manage-h1">Admin Panel</h1>
        <div className="manage-unit">
          <h2 className="admin-manage-h2">Manage top destination: </h2>
          <a href="/manage-top-destination">💿</a>
        </div>
        <div className="manage-unit">
          <h2 className="admin-manage-h2">Manage contact location: </h2>
          <a href="/manage-contact-location">💿</a>
        </div>
      </div>
    </div>
  );
};

export default Admin;
