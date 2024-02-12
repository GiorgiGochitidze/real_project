import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/manager.css";
import UserLocationsMap from "./UserLocationsMap";

const Manager = () => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(true);
  const [showSublist, setShowSublist] = useState(true);
  const [showSubsublist, setShowSubsublist] = useState(true);

  const handleLogout = () => {
    navigate("/LogIn");
  };

  const handleCountryClick = () => {
    setShowSublist(!showSublist);
  };

  const handleCountrySubList = () => {
    setShowSubsublist(!showSubsublist);
  };

  return (
    <>
      <header className="header">
        <nav>
          <button onClick={() => setMenu(!menu)}>MENU</button>
          <button onClick={handleLogout}>Log Out</button>
        </nav>
      </header>

      <main className="main">
        {menu && (
          <div className="options-list">
            <p className="countrys" onClick={handleCountryClick}>
              Country
            </p>
            {showSublist && (
              <div className="sublist">
                <p>Georgia</p>
                <p onClick={handleCountrySubList}>Germany</p>
                {showSubsublist && (
                  <div className="sublist">
                    <p style={{ paddingLeft: "40px" }}>ORE GROUP</p>
                    <p style={{ paddingLeft: "40px" }}>Office N1</p>
                  </div>
                )}
                <p>France</p>
              </div>
            )}
          </div>
        )}

        <UserLocationsMap />
      </main>
    </>
  );
};

export default Manager;
