import React, { useEffect, useState } from "react";
import "./Notices.css";
import API_URL from "../../config/api";

const Notices = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await fetch(`${API_URL}/notices`);

      const data = await res.json();

      setNotices(data);
    } catch (error) {
      console.error("Failed to fetch notices:", error);
    }
  };

  return (
    <section className="notices">
      <div className="notices-hero">
        <h1>
          Library <span>Notices</span>
        </h1>

        <p>
          Stay updated with the latest announcements, holidays, maintenance
          updates and important information from The Study Hub.
        </p>
      </div>

      <div className="notices-container">
        {notices.length > 0 ? (
          notices.map((notice) => (
            <div className="notice-card" key={notice._id}>
              <div className="notice-date">
                {new Date(notice.createdAt).toLocaleDateString()}
              </div>

              <h3>{notice.title}</h3>

              <p>{notice.message}</p>
            </div>
          ))
        ) : (
          <div className="empty-notice">
            <h3>No Notices Available</h3>
            <p>There are currently no announcements from the administration.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Notices;
