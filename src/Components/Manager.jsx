import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/manager.css";
import UserLocationsMap from "./UserLocationsMap";

const Manager = () => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(true);
  const [showSublist, setShowSublist] = useState(true);
  const [showSubsublist, setShowSubsublist] = useState(true);
  const [longitude, setLongitude] = useState(0); // Initialize with 0
  const [latitude, setLatitude] = useState(0); // Initialize with null
  const [shouldZoomToLocation, setShouldZoomToLocation] = useState(false);
  const [zoomLvl, setZoomLvl] = useState(18);

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
                <p
                  onClick={() => {
                    setShouldZoomToLocation(true);
                    setLongitude(43.474859469471696);
                    setLatitude(42.16796048972834);
                    setZoomLvl(6);
                  }}
                >
                  Georgia
                </p>
                <p
                  onClick={() => {
                    handleCountrySubList();
                    setShouldZoomToLocation(true);
                    setLongitude(10.412214115193436)
                    setLatitude(51.16144934462563)
                    setZoomLvl(6)
                  }}
                >
                  Germany
                </p>
                {showSubsublist && (
                  <div className="sublist">
                    <p
                      style={{ paddingLeft: "40px" }}
                      onClick={() => {
                        setShouldZoomToLocation(true);
                        setLongitude(13.317617034555639);
                        setLatitude(52.50161600429857);
                        setZoomLvl(18)
                      }}
                    >
                      ORE GROUP
                    </p>
                    <p style={{ paddingLeft: "40px" }}
                    onClick={() => {
                      setShouldZoomToLocation(true)
                      setLongitude(13.352328417620274)
                      setLatitude(52.50181748663685)
                      setZoomLvl(18)
                    }}
                    >Office N1</p>
                  </div>
                )}
                <p
                onClick={() => {
                  setShouldZoomToLocation(true)
                  setLongitude(2.1808756178674473)
                  setLatitude(46.817608547236645)
                  setZoomLvl(6)
                }}
                >France</p>
              </div>
            )}
          </div>
        )}

        <UserLocationsMap
          longitude={longitude}
          zoomLvl={zoomLvl}
          latitude={latitude}
          shouldZoomToLocation={shouldZoomToLocation}
          setShouldZoomToLocation={setShouldZoomToLocation}
        />
      </main>
    </>
  );
};

export default Manager;
