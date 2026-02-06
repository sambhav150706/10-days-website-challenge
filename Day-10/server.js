const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'messages.json');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration for Admin Security
app.use(session({
    secret: 'your-secret-key-123', // In production, use a secure random string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Helper function to read messages
const readMessages = () => {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DATA_FILE);
    try {
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Helper function to write messages
const writeMessages = (messages) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
};

// --- API Routes ---

// 1. Submit Contact Form
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const newMessage = {
        id: Date.now(),
        name,
        email,
        message,
        timestamp: new Date().toISOString()
    };

    const messages = readMessages();
    messages.push(newMessage);
    writeMessages(messages);

    res.json({ success: true, message: 'Message sent successfully!' });
});

// 2. Admin Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Hardcoded credentials for simplicity
    if (username === 'admin' && password === 'admin123') {
        req.session.isAuthenticated = true;
        req.session.user = username;
        return res.json({ success: true, message: 'Login successful' });
    }

    res.status(401).json({ success: false, error: 'Invalid credentials' });
});

// 3. Get Messages (Protected)
app.get('/api/messages', (req, res) => {
    if (!req.session.isAuthenticated) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const messages = readMessages();
    // Sort by newest first
    messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json({ success: true, messages });
});

// 4. Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logged out' });
});

// 5. Check Auth Status
app.get('/api/auth-check', (req, res) => {
    res.json({ isAuthenticated: !!req.session.isAuthenticated });
});

// Serve the main index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
