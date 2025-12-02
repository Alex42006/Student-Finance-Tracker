import React, { useState, useEffect } from "react";
import "./Budgets.css";

const Budgets = () => {
  const [category, setCategory] = useState("");
  const [limitAmount, setLimitAmount] = useState("");
  const [period, setPeriod] = useState("monthly");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalDeadline, setGoalDeadline] = useState("");

  const [budgets, setBudgets] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const port = import.meta.env.VITE_BACKEND_PORT;
  const userID = Number(localStorage.getItem('userID'));

  // Fetch all budgets
  const fetchBudgets = async () => {
    try {
      const res = await fetch(
        `http://localhost:${port}/budgets/getBudgetsByUser/${userID}`
      );
      const data = await res.json();
      setBudgets(data);
    } catch (err) {
      console.error("Error fetching budgets:", err);
    }
  };

  useEffect(() => {
    if (userID) fetchBudgets();
  }, [userID]);  

  // ADD new budget
  const handleAdd = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:${port}/budgets/addBudget`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID,
        category,
        limitAmount: parseFloat(limitAmount),
        period,
        goalAmount: goalAmount ? parseFloat(goalAmount) : null,
        goalDeadline: goalDeadline || null,
      }),
    });

    resetForm();
    fetchBudgets();
  };

  // UPDATE existing budget
  const handleUpdate = async (e) => {
    e.preventDefault();

    await fetch(
      `http://localhost:${port}/budgets/updateBudget/${editingId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          limitAmount: parseFloat(limitAmount),
          period,
          goalAmount: goalAmount ? parseFloat(goalAmount) : null,
          goalDeadline: goalDeadline || null,
        }),
      }
    );

    resetForm();
    setEditingId(null);
    fetchBudgets();
  };

  // DELETE budget
  const handleDelete = async (id) => {
    await fetch(`http://localhost:${port}/budgets/deleteBudget/${id}`, {
      method: "DELETE",
    });
    fetchBudgets();
  };

  // BEGIN EDIT
  const handleEdit = (b) => {
    setEditingId(b.id);
    setCategory(b.category);
    setLimitAmount(b.limitAmount);
    setPeriod(b.period);
    setGoalAmount(b.goalAmount || "");
    setGoalDeadline(b.goalDeadline ? b.goalDeadline.split("T")[0] : "");
  };

  const resetForm = () => {
    setCategory("");
    setLimitAmount("");
    setPeriod("monthly");
    setGoalAmount("");
    setGoalDeadline("");
  };

  return (
    <div className="budgets-container">
      <h1 className="page-title">Budgets</h1>

      {/* CARD WRAPPER */}
      <div className="budgets-card">
        {/* FORM */}
        <form
          onSubmit={editingId ? handleUpdate : handleAdd}
          className="budgets-form"
        >
          <input
            type="text"
            placeholder="Category (e.g., Food)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Budget Limit (e.g., 200)"
            value={limitAmount}
            onChange={(e) => setLimitAmount(e.target.value)}
            required
          />

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="semester">Semester</option>
          </select>

          <input
            type="number"
            placeholder="Goal Amount (optional)"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
          />

          <input
            type="date"
            placeholder="Goal Deadline"
            value={goalDeadline}
            onChange={(e) => setGoalDeadline(e.target.value)}
          />

          <button type="submit">
            {editingId ? "Update Budget" : "Add Budget"}
          </button>
        </form>
      </div>

      {/* LIST */}
      <h3 className="budgets-title">Your Budgets</h3>

      <ul className="budgets-list">
        {budgets.map((b) => {
          const progress = Math.min(
            (b.spentAmount / b.limitAmount) * 100,
            100
          );

          return (
            <li key={b.id} className="budget-item">
              <div className="budget-info">
                <strong>{b.category}</strong> — ${b.spentAmount} / $
                {b.limitAmount}
                <br />
                Period: {b.period}
                {b.goalAmount && (
                  <>
                    <br />
                    Goal: ${b.goalAmount} by{" "}
                    {b.goalDeadline
                      ? new Date(b.goalDeadline).toLocaleDateString()
                      : ""}
                  </>
                )}
              </div>

              {/* PROGRESS BAR */}
              <div className="budget-progress">
                <div
                  className={`budget-progress-fill ${
                    b.spentAmount > b.limitAmount ? "budget-progress-over" : ""
                  }`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* ACTIONS */}
              <div className="budget-actions">
                <button
                  className="budget-edit"
                  onClick={() => handleEdit(b)}
                >
                  Edit
                </button>

                <button
                  className="budget-delete"
                  onClick={() => handleDelete(b.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Budgets;
