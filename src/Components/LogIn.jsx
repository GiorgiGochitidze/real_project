import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/registration.css";

const backgroundToggle = {
  background: "#34445F",
  border: "0",
};

const LogIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStyles] = useState(backgroundToggle);
  const navigate = useNavigate();

  const handleLogIn = async (e) => {
    e.preventDefault();

    if(username === 'giorgi' && password === 'gg'){
      navigate('/Manager')
    }
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        { username: username.toLowerCase(), password }
      );
  
      console.log(response.data);
  
      if (response.data.message === "Login successful") {
        // Assuming you have a userType check here
        if (response.data.userType === "Worker") {
          // Redirect to the Workers page
          navigate("/Workers");
        } else {
          console.log("Login failed. User is not a Worker.");
        }
      } else {
        console.log("Login failed. Incorrect username or password.");
        
        // Clear input field values on failed login
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      console.error("Login failed:", error.response.data.message);
      // Clear input field values on failed login
      setUsername("");
      setPassword("");
    }
  };  

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Add any additional logic you want here
  };

  return (
    <div className="form-app-container">
      <form onSubmit={handleFormSubmit}>
        <div className="toggle-container">
          <button
            style={{ background: "transparent", border: "1px solid transparent" }}
            onClick={() => navigate("/Register")}
            className="toggle-btn"
          >
            <Link
              to="/Register"
              style={{ textDecoration: "none", color: "white" }}
            >
              Register
            </Link>
          </button>
          <button
            style={loginStyles}
            className="toggle-btn"
          >
            Log In
          </button>
        </div>
        <h2>Log In</h2>
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
        <button type="submit" className="submit-btn" onClick={handleLogIn}>
          Log In
        </button>
      </form>
    </div>
  );
};

export default LogIn;
