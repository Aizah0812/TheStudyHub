import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./ProfileModal.css";
import API_URL from "../../config/api";

const ProfileModal = ({ user, onClose, onLogout }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user?.profileImage || "");
  const [uploading, setUploading] = useState(false);

  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("image", image);

    try {
      setUploading(true);

      const res = await fetch(`${API_URL}/profile/upload/${user._id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Upload failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Profile image updated successfully ✅");

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal-card">
        <button className="profile-close-btn" onClick={onClose}>
          ×
        </button>

        <p className="profile-modal-email">{user?.email}</p>

        <div
          className="profile-modal-avatar"
          style={
            preview
              ? {
                  backgroundImage: `url(${preview})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {}
          }
        >
          {!preview && avatarLetter}
        </div>

        <h2>Hi, {user?.name?.split(" ")[0]}!</h2>

        <p className="profile-modal-subtitle">
          Manage your Study Hub profile and booking details.
        </p>

        <label className="image-upload-label">
          Choose Profile Image
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        <button
          className="image-upload-btn"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>

        <div className="profile-modal-actions">
          <NavLink
            to="/dashboard"
            className="profile-dashboard-btn"
            onClick={onClose}
          >
            My Booking
          </NavLink>

          <button className="profile-logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
