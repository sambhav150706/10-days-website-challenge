# Product Landing Page with Email Signup

A modern, responsive product landing page with an email signup form and a simple Node.js backend.

## Project Structure

```
Day-03/
├── frontend/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # CSS styling
│   └── script.js       # JavaScript for form validation and API calls
├── backend/
│   ├── server.js       # Express server
│   ├── package.json    # Backend dependencies
│   └── data.txt        # User data file (created automatically)
└── README.md           # This file
```

## Features

- ✨ Modern, responsive landing page design
- 📝 Email signup form with validation
- 💾 Saves user data to local text file (data.txt)
- ⏰ Timestamps each entry with date and time
- ✅ Form validation (client-side and server-side)
- 🎉 Success message after submission
- 🎨 Smooth animations and modern UI

## Setup Instructions

### 1. Install Backend Dependencies

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

### 2. Start the Backend Server

```bash
npm start
```

The server will run on `http://localhost:3000`

For development with auto-reload (optional):
```bash
npm run dev
```

### 3. Open the Frontend

Open `frontend/index.html` in your web browser, or use a local server:

**Option 1: Using Python (if installed)**
```bash
cd frontend
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Option 2: Using Node.js http-server (if installed)**
```bash
cd frontend
npx http-server -p 8000
```

**Option 3: Direct file**
Simply double-click `frontend/index.html` to open it in your browser.

## How It Works

1. User fills out the signup form with name and email
2. JavaScript validates the form inputs
3. On submit, data is sent to the Express backend via API
4. Backend validates the data and appends it to `data.txt` with timestamp
5. Success message is displayed to the user

## Data Storage

User signups are saved in `backend/data.txt` with the following format:
```
Date: 12/25/2024, 10:30:45 AM | Name: John Doe | Email: john@example.com
Date: 12/25/2024, 11:15:20 AM | Name: Jane Smith | Email: jane@example.com
```

## API Endpoints

- `POST /api/signup` - Submit signup form
  - Body: `{ "name": "John Doe", "email": "john@example.com" }`
  - Response: `{ "message": "Thank you for signing up!", "success": true }`

- `GET /api/health` - Health check endpoint

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **File System**: Node.js fs module for data storage

## Notes

- Make sure the backend server is running before submitting the form
- The `data.txt` file is created automatically in the backend folder
- CORS is enabled to allow frontend requests
- Form validation works both on client and server side
