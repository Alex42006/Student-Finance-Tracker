import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const location = useLocation()
  
  if (location.pathname === '/') {
    return null
  }
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/transactions" className="navbar-brand">
          Finance Tracker
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link 
              to="/dashboard" 
              className={location.pathname === '/dashboard' ? 'active' : ''}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/transactions" 
              className={location.pathname === '/transactions' ? 'active' : ''}
            >
              Transactions
            </Link>
          </li>
          <li>
            <Link 
              to="/meal-swipes" 
              className={location.pathname === '/meal-swipes' ? 'active' : ''}
            >
              Meal Swipes
            </Link>
          </li>
          <li>
            <Link 
              to="/subscriptions" 
              className={location.pathname === '/subscriptions' ? 'active' : ''}
            >
              Subscriptions
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar