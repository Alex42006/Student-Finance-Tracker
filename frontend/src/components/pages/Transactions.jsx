import React, { useState, useEffect } from "react";
import "./Transactions.css";

const Transactions = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const port = import.meta.env.VITE_BACKEND_PORT;
  const userID = 1;

  // Fetch all transactions
  const fetchTransactions = async () => {
    const res = await fetch(
      `http://localhost:${port}/transactions?userID=${userID}`
    );
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // CREATE or UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      // Update transaction
      await fetch(`http://localhost:${port}/transactions/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          category,
          type,
        }),
      });
    } else {
      // Create transaction
      await fetch(`http://localhost:${port}/transactions/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID,
          amount: parseFloat(amount),
          category,
          type,
        }),
      });
    }

    resetForm();
    fetchTransactions();
  };

  // DELETE
  const handleDelete = async (id) => {
    await fetch(`http://localhost:${port}/transactions/${id}`, {
      method: "DELETE",
    });
    fetchTransactions();
  };

  // BEGIN EDIT
  const handleEdit = (t) => {
    setEditingId(t.id);
    setAmount(t.amount);
    setCategory(t.category);
    setType(t.type);
  };

  // RESET FORM
  const resetForm = () => {
    setAmount("");
    setCategory("");
    setType("expense");
    setEditingId(null);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Transactions</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
          color: "#fff",
        }}
      >
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={inputStyle}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={inputStyle}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <button type="submit" style={addButton}>
          {editingId ? "Update Transaction" : "Add Transaction"}
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
        Your Transactions
      </h3>

      {/* TRANSACTION LIST */}
      <ul style={{ padding: 0, listStyle: "none" }}>
        {transactions.map((t) => (
          <li
            key={t.id}
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
              <strong>${t.amount}</strong> — {t.category} ({t.type})  
              <br />
              <span style={{ opacity: 0.7 }}>
                {formatDate(t.loggedAt)}
              </span>
            </span>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => handleEdit(t)}
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
                onClick={() => handleDelete(t.id)}
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

// INPUT STYLES
const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "rgba(255,255,255,0.2)",
  color: "#fff",
  flex: "1 1 160px",
};

// BUTTON STYLE
const addButton = {
  padding: "12px 20px",
  borderRadius: "8px",
  border: "none",
  background: "#4CAF50",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
  flex: "1 1 160px",
};

export default Transactions;
