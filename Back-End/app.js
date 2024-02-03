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
    const data = fs.readFileSync('registeredUsers.json', 'utf-8');
    registeredUsers = JSON.parse(data);
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
  } catch (error) {
    console.error('Error saving data:', error.message);
  }
};

// POST route for user registration
app.post('/api/register', (req, res) => {
  const { username, password, userType } = req.body;

  // Log the registration data on the backend with new lines
  console.log('\nUser Registration Data (Backend):', { username, password, userType });

  // Check if username already exists
  if (registeredUsers.find(user => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Store user information
  registeredUsers.push({ username, password, userType });

  // Save data to the file
  saveData();

  res.json({ message: 'User registered successfully' });
});

// POST route for user login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
  
    // Check if username and password match any registered user (case-insensitive)
    const user = registeredUsers.find(user => 
      user.username.toLowerCase() === username.toLowerCase() && user.password === password
    );
  
    if (user) {
      res.json({ message: 'Login successful', userType: user.userType });
    } else {
      res.status(401).json({ message: 'Login failed. Incorrect username or password.' });
    }
});

// GET route for the root
app.get('/', (req, res) => {
  // Replace the default message with an object containing registration data
  res.json({
    message: 'Root of the server',
    registrationData: registeredUsers,
  });
});

// Load existing data from file on server startup
loadData();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
