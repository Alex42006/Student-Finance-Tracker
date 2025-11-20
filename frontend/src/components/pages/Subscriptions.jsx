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
  const userID = 1;

  const fetchSubscriptions = async () => {
    const res = await fetch(`http://localhost:${port}/subscriptions/getSubscriptionsByUser/${userID}`);
    const data = await res.json();
    setSubscriptions(data);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

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

    await fetch(`http://localhost:${port}/subscriptions/updateSubscription/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        amount: parseFloat(amount),
        billingCycle,
        description,
        firstPaymentDate,
      }),
    });

    setEditingId(null);
    resetForm();
    fetchSubscriptions();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:${port}/subscriptions/deleteSubscription/${id}`, {
      method: "DELETE",
    });
    fetchSubscriptions();
  };

  const handleEdit = (sub) => {
    setEditingId(sub.id);
    setName(sub.name);
    setAmount(sub.amount);
    setBillingCycle(sub.billingCycle);
    setDescription(sub.description || "");
    setFirstPaymentDate(new Date(sub.firstPaymentDate).toISOString().split("T")[0]);
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
    <div className="subscriptions-container">
      <h2>Subscriptions</h2>

      <form className="subscriptions-form" onSubmit={editingId ? handleUpdate : handleAdd}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)}>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <input type="text" placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="date" value={firstPaymentDate} onChange={(e) => setFirstPaymentDate(e.target.value)} required />
        <button type="submit">{editingId ? "Update Subscription" : "Add Subscription"}</button>
      </form>

      <h3>Your Subscriptions</h3>
      <ul className="subscriptions-list">
        {subscriptions.map((sub) => (
          <li key={sub.id}>
            <div>
              {sub.name} – ${sub.amount} ({sub.billingCycle})  
              – Start: {formatDate(sub.firstPaymentDate)}
            </div>
            <div>
              <button className="subscriptions-edit" onClick={() => handleEdit(sub)}>Edit</button>
              <button className="subscriptions-delete" onClick={() => handleDelete(sub.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Subscriptions;
