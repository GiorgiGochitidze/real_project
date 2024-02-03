const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

let registeredUsers = [];

// Load existing data from a file on server startup
const loadData = () => {
  try {
    const userData = fs.readFileSync('registeredUsers.json', 'utf-8');
    registeredUsers = JSON.parse(userData) || [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If the file doesn't exist, create an empty array and save it to the file
      fs.writeFileSync('registeredUsers.json', '[]', 'utf-8');
    } else {
      console.error('Error loading data:', error.message);
    }
  }
};

// Save data to a file after each registration
const saveData = () => {
  try {
    fs.writeFileSync('registeredUsers.json', JSON.stringify(registeredUsers, null, 2), 'utf-8');
    console.log('Data saved successfully');
  } catch (error) {
    console.error('Error saving data:', error.message);
  }
};

// POST route for user registration
app.post('/api/register', (req, res) => {
  const { username, password, userType } = req.body;

  console.log('\nUser Registration Data (Backend):', { username, password, userType });

  if (registeredUsers.find((user) => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Create a new file for the user and save the timer value
  try {
    fs.writeFileSync(`${username}_timer.json`, JSON.stringify({ timer: 0 }, null, 2), 'utf-8');
    console.log(`Timer file created and saved successfully for ${username}`);
  } catch (error) {
    console.error(`Error creating timer file for ${username}:`, error.message);
  }

  registeredUsers.push({ username, password, userType });
  saveData();

  res.json({ message: 'User registered successfully' });
});

// POST route for updating the timer
app.post('/api/updateTimer', (req, res) => {
  const { username, timer } = req.body;

  const user = registeredUsers.find((user) => user.username === username);

  if (user) {
    try {
      // Update the timer value in the user's timer file
      fs.writeFileSync(`${username}_timer.json`, JSON.stringify({ timer }, null, 2), 'utf-8');
      console.log(`Timer value updated successfully for ${username}`);
      res.json({ message: 'Timer value updated successfully' });
    } catch (error) {
      console.error(`Error updating timer value for ${username}:`, error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// POST route for user login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const user = registeredUsers.find((user) => user.username === username && user.password === password);

  if (user) {
    res.json({ message: 'Login successful', user });
  } else {
    res.status(401).json({ message: 'Login failed. Incorrect username or password.' });
  }
});

// GET route for the root
app.get('/', (req, res) => {
  res.json({
    message: 'Root of the server',
    registrationData: registeredUsers,
  });
});

// Load existing data from files on server startup
loadData();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
