import React, { useState } from "react";
import "./Transactions.css";

const Transactions = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");
  const port = import.meta.env.VITE_BACKEND_PORT;

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:${port}/transactions/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: 1,
        amount: parseFloat(amount),
        category,
        type,
      }),
    });

    setAmount("");
    setCategory("");
    setType("expense");
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Transactions</h1>
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
          Add Transaction
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "rgba(255,255,255,0.2)",
  color: "#fff",
  flex: "1 1 180px",
};

const addButton = {
  padding: "12px 20px",
  borderRadius: "8px",
  border: "none",
  background: "#4CAF50",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
  flex: "1 1 180px",
};

export default Transactions;
