import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/manager.css";
import UserLocationsMap from "./UserLocationsMap";

const countryLinks = {
  georgia:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022268.9332935177!2d40.71716963876666!3d42.290593261057886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40440cd7e64f626b%3A0x4f907964122d4ac2!2sGeorgia!5e0!3m2!1sen!2sge!4v1706939642424!5m2!1sen!2sge",
  oregroup:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d509.1550909838613!2d13.317336276037128!3d52.50149955540906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851aa88f5ef1d%3A0xe2b346188be48f25!2sORE%20Group!5e1!3m2!1sen!2sge!4v1706955435929!5m2!1sen!2sge",
  germany:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5135983.43051635!2d5.172850573951886!3d51.05669921971998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479a721ec2b1be6b%3A0x75e85d6b8e91e55b!2sGermany!5e0!3m2!1sen!2sge!4v1706939828342!5m2!1sen!2sge",
  france:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11430013.40262757!2d-7.984900315222762!3d45.62007585671513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd54a02933785731%3A0x6bfd3f96c747d9f7!2sFrance!5e0!3m2!1sen!2sge!4v1706940147533!5m2!1sen!2sge",
  office:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d349.7756383367493!2d13.351923815799887!3d52.50176491122456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a8504d92f4219b%3A0x15d4c2a570c14419!2sAhornstra%C3%9Fe%201-2!5e1!3m2!1sen!2sge!4v1706955780999!5m2!1sen!2sge",
};

const Manager = () => {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [userLocations, setUserLocations] = useState([]); // Pass your user locations array here
  const [menu, setMenu] = useState(true);
  const [showSublist, setShowSublist] = useState(true);
  const [showSubsublist, setShowSubsublist] = useState(true);

  const handleLogout = () => {
    // Implement logout logic if needed

    // For demonstration purposes, let's navigate to the login page
    navigate("/LogIn");
  };

  const updateLocation = (latitude, longitude) => {
    setCurrentLocation({ latitude, longitude });
  };

  const handleCountryClick = () => {
    // Toggle the visibility of the sublist
    setShowSublist(!showSublist);
  };

  const handleObjectClick = () => {
    // Toggle the visibility of the sublist
    setShowSubsublist(!showSubsublist);
  };

  return (
    <>
      <header className=".header">
        <nav>
          <button onClick={() => (menu ? setMenu(false) : setMenu(true))}>
            MENU
          </button>
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
                <p
                  onClick={() => {
                    setCountries(countryLinks.germany);
                    updateLocation(52.50149955540906, 13.317336276037128); // Update with desired coordinates
                    showSubsublist
                      ? setShowSubsublist(false)
                      : setShowSubsublist(true);
                  }}
                >
                  Germany
                </p>
                {showSubsublist && (
                  <div className="sublist">
                    <p
                      onClick={() => setCountries(countryLinks.oregroup)}
                      style={{ paddingLeft: "40px" }}
                    >
                      ORE GROUP
                    </p>

                    <p
                      onClick={() => setCountries(countryLinks.office)}
                      style={{ paddingLeft: "40px" }}
                    >
                      Office N1
                    </p>
                  </div>
                )}
                <p onClick={() => setCountries(countryLinks.france)}>France</p>
              </div>
            )}
          </div>
        )}

        <div className="map-container">
          {/* Render UserLocationsMap component */}
          <UserLocationsMap
            currentLocation={currentLocation}
            userLocations={userLocations}
            updateLocation={updateLocation}
          />
        </div>
      </main>
    </>
  );
};

export default Manager;
