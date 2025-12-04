import React, { useState, useEffect } from "react";
import "./FinancialAid.css";

const FinancialAid = () => {
  const [aidType, setAidType] = useState("");
  const [amountAwarded, setAmountAwarded] = useState("");
  const [termSeason, setTermSeason] = useState("FALL");
  const [termYear, setTermYear] = useState(new Date().getFullYear());
  const [disbursementDate, setDisbursementDate] = useState("");

  const [repeats, setRepeats] = useState(false);
  const [repeatInterval, setRepeatInterval] = useState("SEMESTER");

  const [financialAid, setFinancialAid] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const port = import.meta.env.VITE_BACKEND_PORT;
  const userID = Number(localStorage.getItem("userID"));

  const fetchFinancialAid = async () => {
    const res = await fetch(
      `http://localhost:${port}/financialAid?userID=${userID}`
    );
    const data = await res.json();
    setFinancialAid(data);
  };

  useEffect(() => {
    if (userID) fetchFinancialAid();
  }, [userID]);  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      userID,
      aidType,
      amountAwarded: Number(amountAwarded),
      termSeason,
      termYear: Number(termYear),
      disbursementDate,
      repeats,
      repeatInterval: repeats ? repeatInterval : null,
    };

    if (editingId) {
      await fetch(`http://localhost:${port}/financialAid/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch(`http://localhost:${port}/financialAid/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    resetForm();
    fetchFinancialAid();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:${port}/financialAid/${id}`, {
      method: "DELETE",
    });
    fetchFinancialAid();
  };

  const handleEdit = (fa) => {
    setEditingId(fa.id);
    setAidType(fa.aidType);
    setAmountAwarded(fa.amountAwarded);
    setTermSeason(fa.termSeason);
    setTermYear(fa.termYear);
    setDisbursementDate(fa.disbursementDate.split("T")[0]);
    setRepeats(fa.repeats);
    setRepeatInterval(fa.repeatInterval || "SEMESTER");
  };

  const resetForm = () => {
    setEditingId(null);
    setAidType("");
    setAmountAwarded("");
    setTermSeason("FALL");
    setTermYear(new Date().getFullYear());
    setDisbursementDate("");
    setRepeats(false);
    setRepeatInterval("SEMESTER");
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Financial Aid</h1>

      <form className="fa-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Aid Type"
          value={aidType}
          onChange={(e) => setAidType(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Amount Awarded"
          value={amountAwarded}
          onChange={(e) => setAmountAwarded(e.target.value)}
          required
        />

        <select value={termSeason} onChange={(e) => setTermSeason(e.target.value)}>
          <option value="SPRING">Spring</option>
          <option value="SUMMER">Summer</option>
          <option value="FALL">Fall</option>
        </select>

        <input
          type="number"
          placeholder="Year"
          value={termYear}
          onChange={(e) => setTermYear(e.target.value)}
          required
        />

        <input
          type="date"
          value={disbursementDate}
          onChange={(e) => setDisbursementDate(e.target.value)}
          required
        />

        <label style={{ color: "#fff" }}>
          <input
            type="checkbox"
            checked={repeats}
            onChange={(e) => setRepeats(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Repeats?
        </label>

        {repeats && (
          <select
            value={repeatInterval}
            onChange={(e) => setRepeatInterval(e.target.value)}
          >
            <option value="SEMESTER">Semester</option>
            <option value="YEAR">Year</option>
            <option value="MONTH">Month</option>
          </select>
        )}

        <button type="submit" className="fa-button">
          {editingId ? "Update Aid" : "Add Aid"}
        </button>
      </form>

      <h3 className="fa-title">Your Financial Aid</h3>

      <ul className="fa-list">
        {financialAid.map((fa) => (
          <li key={fa.id} className="fa-item">
            <span>
              <strong>{fa.aidType}</strong> — ${fa.amountAwarded}  
              <br />
              Term: {fa.termSeason} {fa.termYear}
              <br />
              Disbursed: {fa.disbursementDate.split("T")[0]}
              {fa.repeats && (
                <>
                  <br />
                  Repeats: {fa.repeatInterval}
                </>
              )}
            </span>

            <div className="fa-actions">
              <button className="edit-btn" onClick={() => handleEdit(fa)}>
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(fa.id)}
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

export default FinancialAid;
