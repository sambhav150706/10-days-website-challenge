# ChatLine – Contact / Chat-style Website

Modern contact page with a chat-inspired UI, Node.js backend and local file storage.

## Project structure

- `server.js` – Express server, serves the frontend and handles form submissions.
- `public/` – Static frontend:
  - `index.html` – Layout and markup.
  - `styles.css` – Chat-style design, animations, responsive layout.
  - `app.js` – Form validation, submission logic and UI updates.
- `messages.txt` – Plain text log where submitted messages are appended with timestamps.
- `package.json` – Dependencies and scripts.

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the server**

   ```bash
   npm start
   ```

   or, during development with live reload (if you have `nodemon` installed globally or via the devDependency):

   ```bash
   npm run dev
   ```

3. **Open the app**

   Visit `http://localhost:3000` in your browser.

## How it works

- The frontend shows a chat-inspired panel and a contact form.
- Form fields (`name`, `email`, `message`) are validated client-side:
  - Required checks
  - Basic email format validation
  - Minimum length for the message
- On successful validation, the form is submitted to `POST /api/messages` as JSON.
- The Express backend appends each message to `messages.txt` in the format:

  ```text
  [ISO_TIMESTAMP] Name <email@example.com>: Message text...
  ```

- The server responds with JSON indicating success or an error, and the frontend displays a user-friendly status message and adds your message as a chat bubble.

## Notes

- This project is intentionally simple and file-based; for production use, you would typically swap `messages.txt` for a database.

