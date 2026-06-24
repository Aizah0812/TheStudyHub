import React, { useEffect, useState } from "react";
import "./ComplaintManagement.css";
import API_URL from "../../config/api";

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/complaints`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setComplaints(data);
      }
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const resolveComplaint = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/complaints/${id}/resolve`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to resolve complaint");
        return;
      }

      alert("Complaint resolved successfully ✅");

      fetchComplaints();
    } catch (error) {
      console.error(error);
      alert("Server Error ❌");
    }
  };

  return (
    <div className="complaints-page">
      <div className="complaints-header">
        <h1>Complaint Management</h1>

        <span className="complaint-count">{complaints.length} Complaints</span>
      </div>

      {loading ? (
        <p className="loading-text">Loading complaints...</p>
      ) : complaints.length === 0 ? (
        <div className="empty-box">
          <h3>No Complaints Found</h3>

          <p>No user complaints have been submitted yet.</p>
        </div>
      ) : (
        <div className="complaints-grid">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="complaint-card">
              <div className="complaint-top">
                <div>
                  <h3>{complaint.subject}</h3>

                  <span className="complaint-date">
                    {new Date(complaint.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <span
                  className={`status-badge ${
                    complaint.status === "Resolved" ? "resolved" : "pending"
                  }`}
                >
                  {complaint.status === "Resolved" ? "Resolved" : "Pending"}
                </span>
              </div>

              <div className="complaint-message">{complaint.message}</div>

              <div className="complaint-footer">
                <div className="complaint-user">
                  <strong>{complaint.name}</strong>

                  <p>{complaint.email}</p>
                </div>

                {complaint.status !== "Resolved" && (
                  <button
                    className="resolve-btn"
                    onClick={() => resolveComplaint(complaint._id)}
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintManagement;
