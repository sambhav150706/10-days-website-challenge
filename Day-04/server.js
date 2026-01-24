const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Path to the database file
const DB_FILE = path.join(__dirname, 'users.txt');

// Helper function to read users from file
function readUsers() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    if (data.trim() === '') {
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write users to file
function writeUsers(users) {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// Signup endpoint
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // Read existing users
  const users = readUsers();

  // Check if email already exists
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ success: false, message: 'Email already exists' });
  }

  // Add new user
  const newUser = {
    name: name,
    email: email,
    password: password // In production, this should be hashed!
  };

  users.push(newUser);
  writeUsers(users);

  res.json({ success: true, message: 'Signup successful! You can now login.' });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  // Read users
  const users = readUsers();

  // Find user with matching email and password
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({ success: true, message: 'Login successful!', name: user.name });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
