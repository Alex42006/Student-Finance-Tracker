import React, { useState } from "react";
import "./Profile.css";

const port = import.meta.env.VITE_BACKEND_PORT;

const Profile = () => {
  const userID = Number(localStorage.getItem("userID"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateUsername = async () => {
    const res = await fetch(`http://localhost:${port}/profile/email`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userID, newEmail: username }),
    });

    const data = await res.json();
    setMsg(data.message || data.error);
  };

  const updatePassword = async () => {
    const res = await fetch(`http://localhost:${port}/profile/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userID, newPassword: password }),
    });

    const data = await res.json();
    setMsg(data.message || data.error);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userID");
    localStorage.removeItem("isAdmin");
    window.location.href = "/";
  };

  const deleteAccount = async () => {
    const res = await fetch(`http://localhost:${port}/profile/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userID }),
    });

    const data = await res.json();

    if (data.message) {
      logout();
    } else {
      setMsg(data.error);
    }
  };

  return (
    <div className="profile-page">
      <h1 className="profile-title">Profile Settings</h1>

      <div className="profile-card">
        <h2>Update Username</h2>
        <input
          className="profile-input"
          type="text"
          placeholder="New Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="profile-btn" onClick={updateUsername}>
          Update Username
        </button>
      </div>

      <div className="profile-card">
        <h2>Update Password</h2>
        <input
          className="profile-input"
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="profile-btn" onClick={updatePassword}>
          Update Password
        </button>
      </div>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>

      <button
        className="delete-account-btn"
        onClick={() => setShowDeleteConfirm(true)}
      >
        Delete Account
      </button>

      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-box">
            <p>Are you sure you want to delete your account?</p>
            <p>This action cannot be undone.</p>

            <div className="delete-confirm-actions">
              <button
                className="confirm-delete-btn"
                onClick={deleteAccount}
              >
                Yes, Delete My Account
              </button>
              <button
                className="cancel-delete-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {msg && <p className="profile-msg">{msg}</p>}
    </div>
  );
};

export default Profile;
