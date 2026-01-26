const path = require("path");
const crypto = require("crypto");
const express = require("express");
const session = require("express-session");
const morgan = require("morgan");

const { readJsonFile, writeJsonFile } = require("./fileDb");
const { requireAuth } = require("./auth");

const app = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Demo credentials (beginner-friendly)
const DEMO_USER = { username: "admin", password: "admin123" };

const POSTS_PATH = path.join(__dirname, "data", "posts.txt");

app.use(morgan("dev"));
app.use(express.json({ limit: "300kb" }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      // secure: true, // enable in production (https)
      maxAge: 1000 * 60 * 60 * 12, // 12h
    },
  })
);

// Serve frontend
const PUBLIC_DIR = path.join(__dirname, "..", "public");

// Protect the dashboard route (simple guard)
app.get("/dashboard.html", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/?login=1");
  }
  return res.sendFile(path.join(PUBLIC_DIR, "dashboard.html"));
});

app.use(express.static(PUBLIC_DIR));

function makeId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return crypto.randomBytes(16).toString("hex");
}

async function getAllPosts() {
  const posts = await readJsonFile(POSTS_PATH, []);
  if (!Array.isArray(posts)) return [];
  return posts;
}

async function saveAllPosts(posts) {
  await writeJsonFile(POSTS_PATH, posts);
}

function validatePostInput({ title, content }) {
  const errors = [];
  const cleanTitle = typeof title === "string" ? title.trim() : "";
  const cleanContent = typeof content === "string" ? content.trim() : "";

  if (cleanTitle.length < 3) errors.push("Title must be at least 3 characters.");
  if (cleanTitle.length > 120) errors.push("Title must be under 120 characters.");
  if (cleanContent.length < 20) errors.push("Content must be at least 20 characters.");
  if (cleanContent.length > 20000) errors.push("Content is too long (max 20000 chars).");

  return {
    ok: errors.length === 0,
    errors,
    cleanTitle,
    cleanContent,
  };
}

// --- Auth routes ---
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body || {};
  const u = typeof username === "string" ? username.trim() : "";
  const p = typeof password === "string" ? password : "";

  if (!u || !p) {
    return res.status(400).json({ ok: false, message: "Username and password are required." });
  }

  if (u !== DEMO_USER.username || p !== DEMO_USER.password) {
    return res.status(401).json({ ok: false, message: "Invalid credentials." });
  }

  req.session.user = { username: DEMO_USER.username };
  return res.json({ ok: true, user: req.session.user });
});

app.post("/api/auth/logout", (req, res) => {
  if (!req.session) return res.json({ ok: true });
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/auth/me", (req, res) => {
  const user = req.session && req.session.user ? req.session.user : null;
  res.json({ ok: true, user });
});

// --- Posts routes ---
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await getAllPosts();
    posts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    res.json({ ok: true, posts });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Failed to load posts." });
  }
});

app.get("/api/posts/mine", requireAuth, async (req, res) => {
  try {
    const posts = await getAllPosts();
    const mine = posts
      .filter((p) => p.author === req.session.user.username)
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    res.json({ ok: true, posts: mine });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Failed to load your posts." });
  }
});

app.post("/api/posts", requireAuth, async (req, res) => {
  try {
    const { title, content } = req.body || {};
    const v = validatePostInput({ title, content });
    if (!v.ok) return res.status(400).json({ ok: false, message: v.errors[0], errors: v.errors });

    const posts = await getAllPosts();
    const now = Date.now();

    const post = {
      id: makeId(),
      title: v.cleanTitle,
      content: v.cleanContent,
      author: req.session.user.username,
      createdAt: now,
      updatedAt: now,
    };

    posts.push(post);
    await saveAllPosts(posts);
    res.json({ ok: true, post });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Failed to publish post." });
  }
});

app.put("/api/posts/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body || {};
    const v = validatePostInput({ title, content });
    if (!v.ok) return res.status(400).json({ ok: false, message: v.errors[0], errors: v.errors });

    const posts = await getAllPosts();
    const idx = posts.findIndex((p) => p.id === id);
    if (idx === -1) return res.status(404).json({ ok: false, message: "Post not found." });
    if (posts[idx].author !== req.session.user.username) {
      return res.status(403).json({ ok: false, message: "You can only edit your own posts." });
    }

    posts[idx] = {
      ...posts[idx],
      title: v.cleanTitle,
      content: v.cleanContent,
      updatedAt: Date.now(),
    };

    await saveAllPosts(posts);
    res.json({ ok: true, post: posts[idx] });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Failed to update post." });
  }
});

app.delete("/api/posts/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await getAllPosts();
    const idx = posts.findIndex((p) => p.id === id);
    if (idx === -1) return res.status(404).json({ ok: false, message: "Post not found." });
    if (posts[idx].author !== req.session.user.username) {
      return res.status(403).json({ ok: false, message: "You can only delete your own posts." });
    }

    const [deleted] = posts.splice(idx, 1);
    await saveAllPosts(posts);
    res.json({ ok: true, deletedId: deleted.id });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Failed to delete post." });
  }
});

// Fallback to index.html for unknown routes (simple setup)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Demo login:");
  console.log(`  username: ${DEMO_USER.username}`);
  console.log(`  password: ${DEMO_USER.password}`);
});

