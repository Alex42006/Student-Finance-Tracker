import React from "react";

const mockUsers = [
  { id: 1, name: "Alex", email: "alex@example.com" },
  { id: 2, name: "Luca", email: "luca@example.com" },
  { id: 3, name: "Ben", email: "ben@example.com" },
  { id: 4, name: "Nour", email: "nour@example.com"},
];

export default function ViewUsers() {
  return (
    <div className="page-container">
      <h1 className="page-title">All Users</h1>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {mockUsers.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}