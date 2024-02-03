import React, { useState } from "react";
import "../CSS/registration.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const backgroundToggle = {
  background: "#34445F",
  border: "0",
};

const Registration = () => {
  const [registerStyles, setRegisterStyles] = useState(backgroundToggle);
  const [loginStyles, setLoginStyles] = useState({});
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    userType: "Worker",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignUp = async () => {
    try {
      // Log the form data on the frontend
      console.log('User Registration Data (Frontend):', formData);
  
      // Make a POST request to the server with form data
      const response = await axios.post(
        "http://localhost:5000/api/register",
        formData
      );
  
      console.log(response.data); // Log the response from the server
  
      // Clear form fields after successful registration
      setFormData({
        username: "",
        password: "",
        userType: "Worker",
      });
      
      // Redirect to the login page
      navigate("/Login");
    } catch (error) {
      console.error("Registration failed:", error.response.data.message);
      // You can handle errors, e.g., show an error message to the user
    }
  };
  return (
    <div className="form-app-container">
      <form>
        <div className="toggle-container">
          <button style={registerStyles} className="toggle-btn">
            Register
          </button>

          <button
            style={loginStyles}
            onClick={() => navigate("/Login")}
            className="toggle-btn"
          >
            <Link
              to="/Login"
              style={{ textDecoration: "none", color: "white" }}
            >
              Log In
            </Link>
          </button>
        </div>
        <h2>Sign Up</h2>
        <label id="name">
          User Name:
          <input
          name="username"
          id="name"
          required
          type="text"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="User Name" />
        </label>
        <br />
        <label id="password">
          Password:
          <input
           name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            type="password"
            placeholder="Password"
          />
        </label>
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input required type="radio" name="radio" id="rad2" value="Worker" />{" "}
          Worker
        </div>
        <br />
        <button type="button" className="submit-btn" onClick={handleSignUp}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Registration;
