import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/manager.css";

const countryLinks = {
  georgia:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022268.9332935177!2d40.71716963876666!3d42.290593261057886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40440cd7e64f626b%3A0x4f907964122d4ac2!2sGeorgia!5e0!3m2!1sen!2sge!4v1706939642424!5m2!1sen!2sge",
  batumi:
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d190878.3236062334!2d41.487782683390336!3d41.623889002360976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406786304ea2d221%3A0x7a3053a9e12ea967!2z0JHQsNGC0YPQvNC4!5e0!3m2!1sru!2sge!4v1706944735362!5m2!1sru!2sge",
  germany:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5135983.43051635!2d5.172850573951886!3d51.05669921971998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479a721ec2b1be6b%3A0x75e85d6b8e91e55b!2sGermany!5e0!3m2!1sen!2sge!4v1706939828342!5m2!1sen!2sge",
  france:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11430013.40262757!2d-7.984900315222762!3d45.62007585671513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd54a02933785731%3A0x6bfd3f96c747d9f7!2sFrance!5e0!3m2!1sen!2sge!4v1706940147533!5m2!1sen!2sge",
};

const Manager = () => {
  const navigate = useNavigate();
  const [showSublist, setShowSublist] = useState(false);
  const [countries, setCountries] = useState(countryLinks.georgia);
  const [showSubsublist, setShowSubsublist] = useState(false);
  const [menu, setMenu] = useState(true);

  const handleLogout = () => {
    // Implement logout logic if needed

    // For demonstration purposes, let's navigate to the login page
    navigate("/LogIn");
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
      <header>
        <nav>
          <button onClick={() => (menu ? setMenu(false) : setMenu(true))}>
            MENU
          </button>
          <button onClick={handleLogout}>Log Out</button>
        </nav>
      </header>

      <main>
        {menu && (
          <div className="options-list">
            <p className="countrys" onClick={handleCountryClick}>
              Country
            </p>
            {showSublist && (
              <div className="sublist">
                <p
                  onClick={() => {
                    setCountries(countryLinks.georgia);
                    showSubsublist
                      ? setShowSubsublist(false)
                      : setShowSubsublist(true);
                  }}
                >
                  Georgia
                </p>
                {showSubsublist && (
                  <div className="sublist">
                    <p
                      onClick={() => setCountries(countryLinks.batumi)}
                      style={{ paddingLeft: "40px" }}
                    >
                      Batumi
                    </p>
                  </div>
                )}
                <p onClick={() => setCountries(countryLinks.germany)}>
                  Germany
                </p>
                <p onClick={() => setCountries(countryLinks.france)}>France</p>
              </div>
            )}
          </div>
        )}

        <div className="map-container">
          <iframe
            src={countries}
            width="100%"
            height="100%"
            style={{ border: "0" }}
            allowFullScreen={true}
            loading="async"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </main>
    </>
  );
};

export default Manager;
