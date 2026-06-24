import React, { useEffect, useState } from "react";
import "./MembershipManagement.css";
import API_URL from "../../config/api";

const MembershipManagement = () => {
  const [search, setSearch] = useState("");
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/admin/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setMemberships(data);
    } catch (error) {
      console.error("Failed to fetch memberships:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, action) => {
    try {
      setProcessingId(id);

      const token = localStorage.getItem("token");

      let endpoint = "";

      if (action === "pay") {
        endpoint = `${API_URL}/admin/bookings/${id}/pay`;
      } else if (action === "reject") {
        endpoint = `${API_URL}/admin/bookings/${id}/reject`;
      } else if (action === "renew") {
        endpoint = `${API_URL}/admin/bookings/${id}/renew`;
      }

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update status");
        return;
      }

      fetchMemberships();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setProcessingId(null);
    }
  };

  const downloadMembershipCard = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/booking/membership-card/${bookingId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to download membership card");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "StudyHub-Membership-Card.pdf";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to download membership card");
    }
  };

  const filteredMemberships = memberships.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <h2>Loading Memberships...</h2>;
  }

  return (
    <div className="membership-page">
      <div className="membership-header">
        <h1>Membership Management</h1>
        <p>Manage student subscriptions and plans</p>
      </div>

      <div className="membership-search">
        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="membership-list">
        {filteredMemberships.map((item) => {
          const daysLeft = item.membershipExpiryDate
            ? Math.max(
                0,
                Math.ceil(
                  (new Date(item.membershipExpiryDate) - new Date()) /
                    (1000 * 60 * 60 * 24),
                ),
              )
            : null;

          return (
            <div className="membership-card" key={item._id}>
              <div className="membership-left">
                <h3>{item.name}</h3>

                <div className="membership-details">
                  <span>{item.plan}</span>
                  <span>₹{item.price}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>

                  {item.membershipStartDate && (
                    <span>
                      Start:{" "}
                      {new Date(item.membershipStartDate).toLocaleDateString()}
                    </span>
                  )}

                  {item.membershipExpiryDate && (
                    <span>
                      Expires:{" "}
                      {new Date(item.membershipExpiryDate).toLocaleDateString()}
                    </span>
                  )}

                  {daysLeft !== null && <span>Days Left: {daysLeft}</span>}
                </div>
              </div>

              <div className="membership-right">
                <span
                  className={`membership-status ${item.status.toLowerCase()}`}
                >
                  {item.status}
                </span>

                {item.paymentSubmitted && item.paymentScreenshot && (
                  <a
                    href={item.paymentScreenshot}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="proof-btn"
                  >
                    View Payment Proof
                  </a>
                )}

                {item.status === "Pending" && (
                  <>
                    <button
                      className="renew-btn"
                      disabled={processingId === item._id}
                      onClick={() => updateStatus(item._id, "pay")}
                    >
                      {processingId === item._id ? "Approving..." : "Approve"}
                    </button>

                    <button
                      className="reject-btn"
                      disabled={processingId === item._id}
                      onClick={() => updateStatus(item._id, "reject")}
                    >
                      {processingId === item._id ? "Processing..." : "Reject"}
                    </button>
                  </>
                )}

                {item.status === "Paid" && (
                  <button
                    className="download-card-btn"
                    onClick={() => downloadMembershipCard(item._id)}
                  >
                    Download Membership Card
                  </button>
                )}
                {item.status === "Rejected" && (
                  <button className="rejected-btn">Rejected ✕</button>
                )}

                {item.status === "Expired" && (
                  <>
                    <button className="expired-btn">Expired ⚠️</button>

                    <button
                      className="download-card-btn"
                      onClick={() => downloadMembershipCard(item._id)}
                    >
                      Download Old Card
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MembershipManagement;
