const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Path to messages file
const messagesFilePath = path.join(__dirname, 'messages.txt');

// Ensure messages file exists
if (!fs.existsSync(messagesFilePath)) {
  fs.writeFileSync(messagesFilePath, '', 'utf8');
}

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Handle contact / chat messages
app.post('/api/messages', (req, res) => {
  const { name, email, message } = req.body || {};

  // Simple server-side validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'All fields (name, email, message) are required.'
    });
  }

  const trimmedName = String(name).trim();
  const trimmedEmail = String(email).trim();
  const trimmedMessage = String(message).trim();

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    return res.status(400).json({
      success: false,
      error: 'All fields (name, email, message) are required.'
    });
  }

  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${trimmedName} <${trimmedEmail}>: ${trimmedMessage.replace(/\r?\n/g, ' ')}\n`;

  fs.appendFile(messagesFilePath, line, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to messages.txt:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to save your message. Please try again later.'
      });
    }

    return res.json({
      success: true,
      message: 'Your message has been sent successfully!'
    });
  });
});

// Fallback: serve index.html for root
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

