# Login and Signup System

A simple and beginner-friendly login and signup system built with HTML, CSS, JavaScript, Node.js, and Express.

## Features

- User signup with name, email, and password
- User login with email and password verification
- Dashboard page after successful login
- Error messages for invalid credentials
- Data stored in a local text file (users.txt)

## Setup Instructions

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org/

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   - Navigate to: http://localhost:3000

## Project Structure

```
.
├── server.js          # Express server and API endpoints
├── package.json       # Node.js dependencies
├── users.txt          # Database file (created automatically)
└── public/
    ├── index.html     # Login page
    ├── signup.html    # Signup page
    ├── dashboard.html # Dashboard page
    ├── style.css      # Styling for all pages
    ├── login.js       # Login form handling
    └── signup.js      # Signup form handling
```

## How to Use

1. **Sign Up**: Click on "Sign up" link, fill in your name, email, and password, then submit.
2. **Login**: Use your email and password to login.
3. **Dashboard**: After successful login, you'll be redirected to the dashboard page.

## Important Notes

- Passwords are stored in plain text (for learning purposes only)
- In production, always hash passwords using libraries like bcrypt
- The users.txt file is created automatically when the first user signs up
