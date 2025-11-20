import React, { useState } from 'react'
import './LoginSignup.css'

import userIcon from "../../assets/user.png"
import passwordIcon from "../../assets/password.png"
const port = import.meta.env.VITE_BACKEND_PORT;
import { useNavigate } from 'react-router-dom';

export const LoginSignup = () => {

  const [action, setAction] = useState("Register");
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const API_URL = `http://localhost:${port}`;
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.password) {
      setMessage({ type: 'error', text: 'Username and password are required' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const endpoint = action === "Login" ? `${API_URL}/auth/login` : `${API_URL}/auth/signup`;
 
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        
        if (action === "Login") {
          // Store JWT token
          if (data.token) {
            localStorage.setItem('authToken', data.token);
            console.log('Login successful! Token stored.');
            // Redirect to dashboard or home page
            navigate('/dashboard');
          }
        } else {
          // After successful signup, switch to login
          setFormData({ name: '', username: '', password: '' });
          setTimeout(() => {
            setAction("Login");
            setMessage({ type: '', text: '' });
          }, 2000);
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Something went wrong' });
      }
    } catch (error) {
      console.error('Auth error:', error);
      setMessage({ type: 'error', text: 'Unable to connect to server. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action === "Register" ? (
          <>
          <div className="input">
            <img src={userIcon} alt="" />
            <input type="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name"/>
          </div>
          </>
        ) : null}
        <div className="input">
          <img src={userIcon} alt="" />
          <input type="user" name="username" value={formData.username} onChange={handleInputChange} placeholder="Username"/>
        </div>
        <div className="input">
          <img src={passwordIcon} alt="" />
          <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Password"/>
        </div>
      </div>
      {message.text && (
            <div
              className={`p-3 rounded-lg text-sm font-medium ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}
      <div className="submit-container">
        <div 
          className={action==="Login"?"submit gray": "submit"} 
          onClick={action==="Login"?()=>setAction("Register"):handleSubmit}>Register</div>
        <div 
          className={action==="Register"?"submit gray": "submit"} 
          onClick={action==="Register"?()=>setAction("Login"):handleSubmit}>Login</div>
      </div>
    </div>
  )
}
