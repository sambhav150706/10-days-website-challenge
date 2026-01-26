# GlowBlog (Day-05)

Modern, responsive blog website with:

- Public **blog feed** (cards layout)
- **Login system** (session-based)
- Protected **dashboard** where logged-in users can create, edit, and delete posts
- Simple **Node.js + Express** backend
- File-based database: posts are stored in a local **text file**

## Demo login

- **Username**: `admin`
- **Password**: `admin123`

## Project structure

- `public/` — Frontend (HTML/CSS/JS)
  - `index.html` — Blog feed
  - `dashboard.html` — Protected dashboard
- `server/` — Backend (Express)
  - `server.js` — API + static file hosting
  - `data/posts.txt` — Text-file database (JSON array)

## Run locally

1) Install dependencies:

```bash
cd server
npm install
```

2) Start the server:

```bash
npm start
```

3) Open:

- `http://localhost:3000`

## API (quick reference)

- `POST /api/auth/login` — login (creates session cookie)
- `POST /api/auth/logout` — logout
- `GET /api/auth/me` — current session user
- `GET /api/posts` — all posts (public)
- `GET /api/posts/mine` — your posts (logged-in)
- `POST /api/posts` — create (logged-in)
- `PUT /api/posts/:id` — update (logged-in, own posts only)
- `DELETE /api/posts/:id` — delete (logged-in, own posts only)

