import React, { useEffect } from "react";
import "../CSS/registration.css";
import { Link, useNavigate } from "react-router-dom";

const backgroundToggle = {
  background: "#34445F",
  border: "0",
};

const Registration = () => {
  const [registerStyles, setRegisterStyles] = React.useState(backgroundToggle);
  const [loginStyles, setLoginStyles] = React.useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setRegisterStyles(backgroundToggle);
    setLoginStyles({});
  }, []);

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
          <input id="name" required type="text" placeholder="User Name" />
        </label>
        <br />
        <label id="password">
          Password:
          <input
            id="password"
            required
            type="password"
            placeholder="Password"
          />
        </label>
        <div style={{ display: "flex", gap: "20px", justifyContent: 'center', alignItems: 'center' }}>
          <input type="radio" name="radio" id="rad1" value="Manager" /> Manager
          <input type="radio" name="radio" id="rad2" value="Worker" /> Worker
        </div>
        <br />
        <button type="button" className="submit-btn">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Registration;
