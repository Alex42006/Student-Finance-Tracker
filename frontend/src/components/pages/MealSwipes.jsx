import React, { useState } from "react";

const MealSwipes = () => {
  const [swipesTotal, setSwipesTotal] = useState(14);
  const [swipesUsed, setSwipesUsed] = useState(0);
  const port = import.meta.env.VITE_BACKEND_PORT;

  const handleSave = async () => {
    await fetch(`http://localhost:${port}/mealswipes/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: 1, 
        swipesTotal,
        swipesUsed,
      }),
    });
  };
  return (
    <div>
      <h2>Meal Swipes</h2>
      <input
        type="number"
        placeholder="Total Swipes"
        value={swipesTotal}
        onChange={(e) => {
          const targetValue = e.target.value;
          if(targetValue===""){
            setSwipesTotal("");
          } else {
            setSwipesTotal(Math.max(0,parseInt(targetValue,0)))
          }
        }}
        min="0"
      />
      <input
        type="number"
        placeholder="Swipes Used"
        value={swipesUsed}
        onChange={(e) => {
          const targetValue = e.target.value;
          if(targetValue===""){
            setSwipesUsed("");
          } else {
            setSwipesUsed(Math.max(0,parseInt(targetValue,0)))
          }
        }}
        min="0"
      />
      <p>Remaining: {Math.max(0, swipesTotal - swipesUsed)}</p>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};
export default MealSwipes;
