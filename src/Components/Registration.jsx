import React, { useState } from "react";
import "../CSS/registration.css";
import { Link } from "react-router-dom";

const backgroundToggle = {
  background: "#34445F",
  border: "0",
};

const transparentBackground = {
  background: "transparent",
  border: "1px solid transparent",
};

const Registration = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerStyles, setRegisterStyles] = useState(backgroundToggle);
  const [loginStyles, setLoginStyles] = useState({});

  const handleRegisterClick = (e) => {
    e.preventDefault();
    setRegisterStyles(backgroundToggle);
    setLoginStyles({});
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    setRegisterStyles(transparentBackground);
    setLoginStyles(backgroundToggle);
  };

  return (
    <div className="form-app-container">
      <form>
        <div className="toggle-container">
          <Link to='/Register'><button
            style={registerStyles}
            onClick={handleRegisterClick}
            className="toggle-btn"
          >
            Register
          </button></Link>

          <Link to='/Login'><button
            style={loginStyles}
            onClick={handleLoginClick}
            className="toggle-btn"
          >
            Log In
          </button></Link>
        </div>
        <h2>Sign Up</h2>
        <label>
          User Name:
          <input
            required
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="User Name"
          />
        </label>
        <br />
        <label>
          Password:
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </label>
        <br />
        <button type="button" className="submit-btn">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Registration;
