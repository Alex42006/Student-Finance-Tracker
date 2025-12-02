import React, { useState, useEffect } from "react";
import "./Transactions.css";

const Transactions = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");
  const [loggedAt, setLoggedAt] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const port = import.meta.env.VITE_BACKEND_PORT;
  const userID = Number(localStorage.getItem("userID"));

  const fetchTransactions = async () => {
    const res = await fetch(
      `http://localhost:${port}/transactions?userID=${userID}`
    );
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    if (userID) fetchTransactions();
  }, [userID]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      amount: parseFloat(amount),
      category,
      type,
      loggedAt: loggedAt ? new Date(loggedAt) : new Date()
    };

    if (editingId) {
      await fetch(`http://localhost:${port}/transactions/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch(`http://localhost:${port}/transactions/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID,
          ...body
        }),
      });
    }

    resetForm();
    fetchTransactions();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:${port}/transactions/${id}`, {
      method: "DELETE",
    });
    fetchTransactions();
  };

  const handleEdit = (t) => {
    setEditingId(t.id);
    setAmount(t.amount);
    setCategory(t.category);
    setType(t.type);
    setLoggedAt(t.loggedAt ? t.loggedAt.split("T")[0] : "");
  };

  const resetForm = () => {
    setAmount("");
    setCategory("");
    setType("expense");
    setLoggedAt("");
    setEditingId(null);
    setShowSuggestions(false);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  const categories = [...new Set(transactions.map(t => t.category))].sort();
  const filteredSuggestions = categories.filter(cat =>
    cat.toLowerCase().includes(category.toLowerCase())
  );

  return (
    <div className="transactions-page">
      <h1 className="transactions-title">Transactions</h1>

      <form className="transactions-form" onSubmit={handleSubmit}>
        <input
          type="number"
          className="transactions-input"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

      <div className="category-wrapper">
        <input
          type="text"
          className="transactions-input"
          placeholder="Category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          required
        />

        {showSuggestions && (
          <ul className="category-suggestions">
            {(category === "" ? categories : categories.filter(cat =>
              cat.toLowerCase().includes(category.toLowerCase())
            )).map((cat, idx) => (
              <li
                key={idx}
                onMouseDown={() => {
                  setCategory(cat);
                  setShowSuggestions(false);
                }}
              >
                {cat}
              </li>
            ))}
          </ul>
        )}
      </div>

        <select
          className="transactions-input"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          type="date"
          className="transactions-input"
          value={loggedAt}
          onChange={(e) => setLoggedAt(e.target.value)}
        />

        <button type="submit" className="transactions-submit">
          {editingId ? "Update Transaction" : "Add Transaction"}
        </button>
      </form>

      <h3 className="transactions-subtitle">Your Transactions</h3>

      <ul className="transactions-list">
        {transactions.map((t) => (
          <li key={t.id} className="transactions-item">
            <span>
              <strong>${t.amount}</strong> — {t.category} ({t.type})
              <br />
              <span className="transactions-date">
                {formatDate(t.loggedAt)}
              </span>
            </span>

            <div className="transactions-actions">
              <button
                onClick={() => handleEdit(t)}
                className="transactions-btn edit-btn"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(t.id)}
                className="transactions-btn delete-btn"
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

export default Transactions;
