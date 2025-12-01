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
        <Link to="/dashboard" className="navbar-brand">
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

          {/* NEW DINING TAB — ONLY CHANGE ADDED */}
          <li>
            <Link 
              to="/dining" 
              className={location.pathname === '/dining' ? 'active' : ''}
            >
              Dining Expenses
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
              to="/financial-aid" 
              className={location.pathname === '/financial-aid' ? 'active' : ''}
            >
              Financial Aid
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
          <li>
            <Link 
              to="/manage-users" 
              className={location.pathname === '/manage-users' ? 'active' : ''}
            >
              Manage Users
            </Link>
          </li>

          <li>
            <Link 
              to="/budgets" 
              className={location.pathname === '/budgets' ? 'active' : ''}
            >
              Budgets
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
