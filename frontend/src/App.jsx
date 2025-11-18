import React from "react"
import './App.css'
import { LoginSignup } from './components/login/LoginSignup'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Transactions from './components/pages/Transactions'
import MealSwipes from './components/pages/MealSwipes'
import Subscriptions from "./components/pages/Subscriptions"
import ViewUsers from "./components/pages/ViewUsers";
import ManageUsers from "./components/pages/ManageUsers";

function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginSignup />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/meal-swipes" element={<MealSwipes />} />
      <Route path="/subscriptions" element={<Subscriptions />} />
      <Route path="/users" element={<ViewUsers />} />
      <Route path="/manage-users" element={<ManageUsers />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
