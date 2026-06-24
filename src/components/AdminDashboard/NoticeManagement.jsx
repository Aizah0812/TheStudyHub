import React, { useEffect, useState } from "react";
import "./NoticeManagement.css";
import API_URL from "../../config/api";

const NoticeManagement = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notices, setNotices] = useState([]);

  const fetchNotices = async () => {
    try {
      const res = await fetch(`${API_URL}/notices`);

      const data = await res.json();

      setNotices(data);
    } catch (error) {
      console.error("Failed to fetch notices:", error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/notices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Notice created successfully");

      setTitle("");
      setMessage("");

      fetchNotices();
    } catch (error) {
      console.error(error);
      alert("Failed to create notice");
    }
  };

  const deleteNotice = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/notices/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      fetchNotices();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="notice-page">
      <div className="notice-header">
        <h1>Notice Management</h1>
        <p>Create and manage library notices</p>
      </div>

      <form className="notice-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Notice Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Notice Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <button type="submit">Publish Notice</button>
      </form>

      <div className="notice-list">
        {notices.map((notice) => (
          <div className="notice-card" key={notice._id}>
            <h3>{notice.title}</h3>

            <p>{notice.message}</p>

            <button
              className="delete-btn"
              onClick={() => deleteNotice(notice._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeManagement;
