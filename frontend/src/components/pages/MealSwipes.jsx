import React, { useState, useEffect } from "react";
import "./MealSwipes.css";

const MealSwipes = () => {
  const [formSwipesTotal, setFormSwipesTotal] = useState("");
  const [formSwipesUsed, setFormSwipesUsed] = useState("");
  const [formDiningDollars, setFormDiningDollars] = useState("");

  const [dbSwipesTotal, setDbSwipesTotal] = useState("");
  const [dbSwipesUsed, setDbSwipesUsed] = useState("");
  const [dbDiningDollars, setDbDiningDollars] = useState("");

  const [mealSwipeId, setMealSwipeId] = useState(null);

  const port = import.meta.env.VITE_BACKEND_PORT;
  const userID = Number(localStorage.getItem("userID"));

  const fetchMealSwipe = async () => {
    const res = await fetch(
      `http://localhost:${port}/mealswipes/getMealSwipeByUser/${userID}`
    );
    const data = await res.json();

    if (data) {
      setMealSwipeId(data.id);

      setDbSwipesTotal(String(data.swipesTotal));
      setDbSwipesUsed(String(data.swipesUsed));
      setDbDiningDollars(String(data.diningDollars));

      setFormSwipesTotal(String(data.swipesTotal));
      setFormSwipesUsed(String(data.swipesUsed));
      setFormDiningDollars(String(data.diningDollars));
    } else {
      setMealSwipeId(null);

      setDbSwipesTotal("");
      setDbSwipesUsed("");
      setDbDiningDollars("");

      setFormSwipesTotal("");
      setFormSwipesUsed("");
      setFormDiningDollars("");
    }
  };

  useEffect(() => {
    if (userID) {
      fetchMealSwipe();
    }
  }, [userID]);

  const handleSave = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:${port}/mealswipes/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID,
        swipesTotal: Number(formSwipesTotal || 0),
        swipesUsed: Number(formSwipesUsed || 0),
        diningDollars: Number(formDiningDollars || 0),
      }),
    });

    fetchMealSwipe();
  };

  const handleDelete = async () => {
    if (!mealSwipeId) return;

    await fetch(`http://localhost:${port}/mealswipes/delete/${mealSwipeId}`, {
      method: "DELETE",
    });

    setMealSwipeId(null);

    setDbSwipesTotal("");
    setDbSwipesUsed("");
    setDbDiningDollars("");

    setFormSwipesTotal("");
    setFormSwipesUsed("");
    setFormDiningDollars("");
  };

  const dbRemaining =
    dbSwipesTotal && dbSwipesUsed
      ? Number(dbSwipesTotal) - Number(dbSwipesUsed)
      : 0;

  return (
    <div className="page-container">
      <h1 className="page-title">Meal Swipes</h1>

      <form onSubmit={handleSave} className="mealswipes-form">
        <input
          type="number"
          className="mealswipes-input"
          placeholder="Total Swipes"
          value={formSwipesTotal}
          onChange={(e) =>
            setFormSwipesTotal(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />

        <input
          type="number"
          className="mealswipes-input"
          placeholder="Swipes Used"
          value={formSwipesUsed}
          onChange={(e) =>
            setFormSwipesUsed(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />

        <input
          type="number"
          className="mealswipes-input"
          placeholder="Dining Dollars"
          value={formDiningDollars}
          onChange={(e) =>
            setFormDiningDollars(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />

        <button type="submit" className="mealswipes-button">
          {mealSwipeId ? "Update Meal Swipes" : "Save Meal Swipes"}
        </button>

        {mealSwipeId && (
          <button
            type="button"
            className="mealswipes-delete"
            onClick={handleDelete}
          >
            Delete Meal Swipe Record
          </button>
        )}
      </form>

      {mealSwipeId && (
        <div className="mealswipes-display">
          <h3>Current Meal Swipe Data</h3>
          <p><strong>Total Swipes:</strong> {dbSwipesTotal}</p>
          <p><strong>Swipes Used:</strong> {dbSwipesUsed}</p>
          <p><strong>Remaining Swipes:</strong> {dbRemaining}</p>
          <p><strong>Dining Dollars Remaining:</strong> ${dbDiningDollars}</p>
        </div>
      )}
    </div>
  );
};

export default MealSwipes;
