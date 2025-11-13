import './App.css'
import { LoginSignup } from './components/login/LoginSignup'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ViewTransactions from './pages/ViewTransactions'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Luca's login page remains the default route */}
        <Route path="/" element={<LoginSignup />} />

        {/* Nour's new page gets its own route */}
        <Route path="/transactions" element={<ViewTransactions />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
