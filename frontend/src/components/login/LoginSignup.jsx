import React, { useState } from 'react'
import './LoginSignup.css'

import userIcon from "../../assets/user.png"
import passwordIcon from "../../assets/password.png"

export const LoginSignup = () => {

  const [action, setAction] = useState("Register");

  return (
    <div className='container'>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img src={userIcon} alt="" />
          <input type="user" placeholder="Username"/>
        </div>
        <div className="input">
          <img src={passwordIcon} alt="" />
          <input type="password" placeholder="Password"/>
        </div>
      </div>
      <div className="submit-container">
        <div className={action==="Login"?"submit gray": "submit"} onClick={()=>{setAction("Register")}}>Register</div>
        <div className={action==="Register"?"submit gray": "submit"} onClick={()=>(setAction("Login"))}>Login</div>
      </div>
    </div>
  )
}
