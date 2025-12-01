import React from "react"
import './App.css'
import { LoginSignup } from './components/login/LoginSignup'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Transactions from './components/pages/Transactions'
import MealSwipes from './components/pages/MealSwipes'
import Subscriptions from "./components/pages/Subscriptions"
import ViewUsers from "./components/pages/ViewUsers";
import ManageUsers from "./components/pages/ManageUsers";
import Dashboard from './components/pages/Dashboard'
import FinancialAid from './components/pages/FinancialAid'
import Navbar from './components/Navbar'
import Budgets from "./components/pages/Budgets.jsx";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/meal-swipes" element={<MealSwipes />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/users" element={<ViewUsers />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/financial-aid" element={<FinancialAid />} />
        <Route path="/budgets" element={<Budgets />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App