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
    <div className="transactions-container">
      <h2>Transactions</h2>
      <form className="transactions-card" onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <button type="submit">Add Transaction</button>
      </form>
    </div>
  );
};

export default Transactions;
