import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/manager.css";

const Manager = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout logic if needed

    // For demonstration purposes, let's navigate to the login page
    navigate("/LogIn");
  };

  return (
    <>
      <header>
        <nav>
          <button>MENU</button>
          <button onClick={handleLogout}>Log Out</button>
        </nav>
      </header>

      <main>
        <div className="options-list">
          <p>Country</p>
          <p>Object</p>
        </div>

        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d8408.925858977822!2d41.63828106857102!3d41.64811705552181!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sge!4v1706897592156!5m2!1sen!2sge"
            width="100%"
            height="100%"
            style={{ border: "0" }}
            loading="lazy"
            allowFullScreen={true}
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </main>
    </>
  );
};

export default Manager;
