const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let registeredUsers = [];

// Load existing data from a file on server startup
const loadData = () => {
  try {
    const userData = fs.readFileSync("registeredUsers.json", "utf-8");
    registeredUsers = JSON.parse(userData) || [];
  } catch (error) {
    if (error.code === "ENOENT") {
      // If the file doesn't exist, create an empty array and save it to the file
      fs.writeFileSync("registeredUsers.json", "[]", "utf-8");
    } else {
      console.error("Error loading data:", error.message);
    }
  }
};

// Save data to a file after each registration
const saveData = () => {
  try {
    fs.writeFileSync(
      "registeredUsers.json",
      JSON.stringify(registeredUsers, null, 2),
      "utf-8"
    );
    console.log("Data saved successfully");
  } catch (error) {
    console.error("Error saving data:", error.message);
  }
};

// POST route for user registration
app.post("/api/register", (req, res) => {
  const { username, password, userType } = req.body;

  console.log("\nUser Registration Data (Backend):", {
    username,
    password,
    userType,
  });

  if (registeredUsers.find((user) => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Create a new file for the user and save the timer value
  try {
    fs.writeFileSync(
      `${username}_timer.json`,
      JSON.stringify({ timer: 0 }, null, 2),
      "utf-8"
    );
    console.log(`Timer file created and saved successfully for ${username}`);
  } catch (error) {
    console.error(`Error creating timer file for ${username}:`, error.message);
  }

  registeredUsers.push({ username, password, userType });
  saveData();

  res.json({ message: "User registered successfully" });
});

// POST route for user login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = registeredUsers.find(
    (user) => user.username === username && user.password === password
  );

  if (user) {
    res.json({ message: "Login successful", user });
  } else {
    res
      .status(401)
      .json({ message: "Login failed. Incorrect username or password." });
  }
});

// POST route for saving user location
app.post("/api/saveUserLocation", (req, res) => {
  const { username, location } = req.body;

  try {
    const filePath = "./user_locations.json";

    // Load existing location data
    let locationData = {};
    try {
      const locationDataString = fs.readFileSync(filePath, "utf-8");
      locationData = JSON.parse(locationDataString) || {};
    } catch (error) {
      if (error.code === "ENOENT") {
        // If the file doesn't exist, create an empty object
        fs.writeFileSync(filePath, "{}", "utf-8");
      } else {
        console.error("Error loading location data:", error.message);
      }
    }

    // Save the user's location
    locationData[username] = location;

    // Save updated location data to the file
    fs.writeFileSync(filePath, JSON.stringify(locationData, null, 2), "utf-8");

    // Notify connected clients about the new location
    if (app.get("wss")) {
      app.get("wss").clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({ type: "locationUpdate", username, location })
          );
        }
      });
    }

    res.json({ message: "User location saved successfully" });
  } catch (error) {
    console.error(`Error saving user location for ${username}:`, error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/getUserLocations", (req, res) => {
  try {
    const filePath = "./user_locations.json";
    const locationDataString = fs.readFileSync(filePath, "utf-8");
    const userLocations = JSON.parse(locationDataString) || {};
    res.json(userLocations);
  } catch (error) {
    console.error("Error fetching user locations:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/updateTimer", (req, res) => {
  const { username, timer } = req.body;

  try {
    const filePath = "all_users_timer.json";

    // Load existing timer data
    let timerData = {};
    try {
      const timerDataString = fs.readFileSync(filePath, "utf-8");
      timerData = JSON.parse(timerDataString) || {};
    } catch (error) {
      if (error.code === "ENOENT") {
        // If the file doesn't exist, create an empty object
        fs.writeFileSync(filePath, "{}", "utf-8");
      } else {
        console.error("Error loading timer data:", error.message);
      }
    }

    // Update the timer value for the user
    timerData[username] = timer;

    // Save updated timer data to the file
    fs.writeFileSync(filePath, JSON.stringify(timerData, null, 2), "utf-8");

    res.json({ message: "Timer value updated successfully" });
  } catch (error) {
    console.error(`Error updating timer value for ${username}:`, error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST route for saving working time
app.post("/api/saveWorkingTime", (req, res) => {
  const { username, workingTime } = req.body;

  try {
    const filePath = "all_users_timer.json";

    // Load existing timer data
    let timerData = {};
    try {
      const timerDataString = fs.readFileSync(filePath, "utf-8");
      timerData = JSON.parse(timerDataString) || {};
    } catch (error) {
      if (error.code === "ENOENT") {
        // If the file doesn't exist, create an empty object
        fs.writeFileSync(filePath, "{}", "utf-8");
      } else {
        console.error("Error loading timer data:", error.message);
      }
    }

    // Update the timer value for the user
    timerData[username] = workingTime;

    // Save updated timer data to the file
    fs.writeFileSync(filePath, JSON.stringify(timerData, null, 2), "utf-8");

    res.json({ message: "Working time saved successfully" });
  } catch (error) {
    console.error(`Error saving working time for ${username}:`, error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});
// GET route for the root
app.get("/", (req, res) => {
  res.json({
    message: "Root of the server",
    registrationData: registeredUsers,
  });
});

// Load existing data from files on server startup
loadData();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
