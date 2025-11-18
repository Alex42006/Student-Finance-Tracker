import React, { useState } from "react";

const initialUsers = [
  { id: 1, name: "Alex", email: "alex@example.com" },
  { id: 2, name: "Luca", email: "luca@example.com" },
  { id: 3, name: "Ben", email: "ben@example.com" },
  { id: 4, name: "Nour", email: "nour@example.com" },
];

export default function ManageUsers() {
  const [users, setUsers] = useState(initialUsers);

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Manage Users</h1>

      {users.map(u => (
        <div 
          key={u.id} 
          style={{
            background: "rgba(255,255,255,0.15)",
            padding: "12px 16px",
            borderRadius: 12,
            marginBottom: 12,
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <span>{u.name} ({u.email})</span>
          <button className="btn btn-delete" onClick={() => deleteUser(u.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
