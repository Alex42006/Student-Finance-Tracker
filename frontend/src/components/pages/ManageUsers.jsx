import React, { useEffect, useState } from "react";
import "./ManageUsers.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  const port = import.meta.env.VITE_BACKEND_PORT;
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    if (!isAdmin) {
      window.location.href = "/dashboard";
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("authToken");

    const res = await fetch(`http://localhost:${port}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    setUsers(data);
  };

  const deleteUser = async (id) => {
    const token = localStorage.getItem("authToken");

    await fetch(`http://localhost:${port}/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div className="manage-users-container">
      <h1 className="manage-users-title">Manage Users</h1>

      {users.map(u => (
        <div key={u.id} className="user-card">
          <div className="user-info">
            <strong className="user-email">{u.email}</strong>
            <span className="created-at">
              Created: {new Date(u.createdAt).toLocaleDateString()}
            </span>
          </div>

          <button 
            className="delete-user-btn"
            onClick={() => deleteUser(u.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
