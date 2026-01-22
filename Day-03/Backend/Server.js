const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.txt');

// Middleware
app.use(cors()); // Allow frontend to make requests
app.use(express.json()); // Parse JSON request bodies

// Create data.txt file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '', 'utf8');
    console.log('Created data.txt file');
}

// Helper function to get current date and time
function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
}

// API endpoint to handle signup
app.post('/api/signup', (req, res) => {
    try {
        const { name, email } = req.body;

        // Validate input
        if (!name || !email) {
            return res.status(400).json({
                error: 'Name and email are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        // Format the entry with date and time
        const dateTime = getCurrentDateTime();
        const entry = `Date: ${dateTime} | Name: ${name} | Email: ${email}\n`;

        // Append to data.txt file
        fs.appendFileSync(DATA_FILE, entry, 'utf8');

        console.log('New signup saved:', { name, email, dateTime });

        // Send success response
        res.status(200).json({
            message: 'Thank you for signing up! Your information has been saved.',
            success: true
        });

    } catch (error) {
        console.error('Error saving signup:', error);
        res.status(500).json({
            error: 'Failed to save signup information. Please try again later.'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Data will be saved to: ${DATA_FILE}`);
});
