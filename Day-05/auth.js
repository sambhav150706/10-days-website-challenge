function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ ok: false, message: "You must be logged in." });
  }
  next();
}

module.exports = { requireAuth };

