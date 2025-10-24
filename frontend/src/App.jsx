import React from "react"
import './App.css'
import { LoginSignup } from './components/login/LoginSignup'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Transactions from './components/pages/Transactions'
import MealSwipes from './components/pages/MealSwipes'

function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginSignup />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/meal-swipes" element={<MealSwipes />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
