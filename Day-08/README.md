# Minimal To‑Do / Notes Web App

A small, modern, and minimal to‑do / notes web app built with **vanilla HTML, CSS, and JavaScript**.

## Features

- **Add tasks / notes** with an optional description area for extra details.
- **Edit tasks** in-place by clicking the pencil icon.
- **Delete tasks** using the close icon.
- **Mark as completed** with a custom checkbox and clear visual distinction:
  - Completed items are slightly faded, with a dashed border and line-through text.
- **Local persistence**: all tasks are stored in the browser’s `localStorage`, so your list survives refreshes.
- **Empty state message** when there are no tasks yet.
- **Responsive layout** that looks good on mobile and desktop.
- **Subtle animations** for adding/removing tasks and interacting with controls.

## Files

- `index.html` – main HTML structure and app shell.
- `style.css` – styling, spacing, animations, and responsive layout.
- `script.js` – application logic for CRUD operations and localStorage.

## Dependencies

This project uses **no external JavaScript dependencies**.

The only external resource is an optional Google Font (Inter) referenced in `index.html` for a more modern look. The app still works if the font fails to load.

## How to Run

Simply open `index.html` in a modern browser (Chrome, Edge, Firefox, Safari).

No build tools or servers are required.

