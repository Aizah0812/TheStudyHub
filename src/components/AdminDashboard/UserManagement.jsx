import React, { useEffect, useState } from "react";
import { FaUser, FaSearch, FaUserShield, FaTrash } from "react-icons/fa";
import API_URL from "../../config/api";
import "./UserManagement.css";

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("User deleted successfully ✅");

      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <h2>Loading Users...</h2>;
  }

  return (
    <div className="users-page">
      <div className="users-header">
        <h1>User Management</h1>
        <p>Manage registered users and admins</p>
      </div>

      <div className="user-stats">
        <div className="user-stat-card">
          <h3>{users.length}</h3>
          <span>Total Users</span>
        </div>

        <div className="user-stat-card">
          <h3>{users.filter((u) => u.role === "admin").length}</h3>
          <span>Admins</span>
        </div>

        <div className="user-stat-card">
          <h3>{users.filter((u) => u.role === "user").length}</h3>
          <span>Students</span>
        </div>
      </div>

      <div className="search-box">
        <FaSearch />

        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="user-info">
                    {user.profileImage ? (
                      <div className="user-avatar">
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="user-avatar-img"
                        />
                      </div>
                    ) : (
                      <div className="user-avatar">
                        <FaUser />
                      </div>
                    )}

                    <div>
                      <h4>{user.name}</h4>
                    </div>
                  </div>
                </td>

                <td>{user.email}</td>

                <td>
                  <span
                    className={
                      user.role === "admin" ? "active-badge" : "expired-badge"
                    }
                  >
                    {user.role === "admin" ? (
                      <>
                        <FaUserShield />
                        Admin
                      </>
                    ) : (
                      "Student"
                    )}
                  </span>
                </td>

                <td>
                  {user.role !== "admin" && (
                    <button
                      className="delete-user"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
