import React, { useState, useEffect } from "react";
import "./Subscriptions.css";

const Subscriptions = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [description, setDescription] = useState("");
  const [firstPaymentDate, setFirstPaymentDate] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const port = import.meta.env.VITE_BACKEND_PORT;
  const userID = Number(localStorage.getItem("userID"));

  const fetchSubscriptions = async () => {
    const res = await fetch(
      `http://localhost:${port}/subscriptions/getSubscriptionsByUser/${userID}`
    );
    const data = await res.json();
    setSubscriptions(data);
  };

  useEffect(() => {
    if (userID) fetchSubscriptions();
  }, [userID]);

  const handleAdd = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:${port}/subscriptions/addSubscription`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID,
        name,
        amount: parseFloat(amount),
        billingCycle,
        description,
        firstPaymentDate,
      }),
    });

    resetForm();
    fetchSubscriptions();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    await fetch(
      `http://localhost:${port}/subscriptions/updateSubscription/${editingId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          amount: parseFloat(amount),
          billingCycle,
          description,
          firstPaymentDate,
        }),
      }
    );

    setEditingId(null);
    resetForm();
    fetchSubscriptions();
  };

  const handleDelete = async (id) => {
    await fetch(
      `http://localhost:${port}/subscriptions/deleteSubscription/${id}`,
      {
        method: "DELETE",
      }
    );
    fetchSubscriptions();
  };

  const handleEdit = (sub) => {
    setEditingId(sub.id);
    setName(sub.name);
    setAmount(sub.amount);
    setBillingCycle(sub.billingCycle);
    setDescription(sub.description || "");
    setFirstPaymentDate(
      new Date(sub.firstPaymentDate).toISOString().split("T")[0]
    );
  };

  const resetForm = () => {
    setName("");
    setAmount("");
    setBillingCycle("monthly");
    setDescription("");
    setFirstPaymentDate("");
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`;
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Subscriptions</h1>

      <form
        onSubmit={editingId ? handleUpdate : handleAdd}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
          color: "#fff",
        }}
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            flex: "1 1 150px",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "rgba(255,255,255,0.2)",
            color: "#fff",
          }}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={{
            flex: "1 1 100px",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "rgba(255,255,255,0.2)",
            color: "#fff",
          }}
        />

        <select
          value={billingCycle}
          onChange={(e) => setBillingCycle(e.target.value)}
          style={{
            flex: "1 1 120px",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "rgba(255,255,255,0.2)",
            color: "#fff",
          }}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            flex: "1 1 250px",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "rgba(255,255,255,0.2)",
            color: "#fff",
          }}
        />

        <input
          type="date"
          placeholder="Start Date"
          value={firstPaymentDate}
          onChange={(e) => setFirstPaymentDate(e.target.value)}
          required
          style={{
            flex: "1 1 160px",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "rgba(255,255,255,0.2)",
            color: "#fff",
          }}
        />

        <button
          type="submit"
          style={{
            flex: "1 1 150px",
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            background: editingId ? "#ffa726" : "#4CAF50",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {editingId ? "Update Subscription" : "Add Subscription"}
        </button>
      </form>

      {/* LIST TITLE */}
      <h3
        style={{
          textAlign: "center",
          color: "#fff",
          marginBottom: 12,
          fontSize: 20,
        }}
      >
        Your Subscriptions
      </h3>

      <ul style={{ padding: 0, listStyle: "none" }}>
        {subscriptions.map((sub) => (
          <li
            key={sub.id}
            style={{
              background: "rgba(255,255,255,0.15)",
              padding: "14px 18px",
              borderRadius: 12,
              marginBottom: 12,
              color: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "16px",
            }}
          >
            <span>
              {sub.name} — ${sub.amount} ({sub.billingCycle})  
              — Start: {formatDate(sub.firstPaymentDate)}
            </span>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => handleEdit(sub)}
                className="btn"
                style={{
                  padding: "6px 12px",
                  background: "#2196F3",
                  borderRadius: 6,
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(sub.id)}
                className="btn btn-delete"
                style={{
                  padding: "6px 12px",
                  background: "#ff5252",
                  borderRadius: 6,
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Subscriptions;
