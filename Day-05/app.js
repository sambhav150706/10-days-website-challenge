(() => {
  const toastWrap = () => document.getElementById("toastWrap");

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else node.setAttribute(k, v);
    }
    for (const c of children) node.appendChild(c);
    return node;
  }

  function formatDate(ts) {
    try {
      return new Date(ts).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  }

  function toast({ title, message, type = "ok", timeout = 2800 }) {
    const wrap = toastWrap();
    if (!wrap) return;

    const node = el("div", { class: `toast toast--${type}` }, [
      el("p", { class: "toast__title", text: title }),
      el("p", { class: "toast__msg", text: message }),
    ]);

    wrap.appendChild(node);
    setTimeout(() => {
      node.style.opacity = "0";
      node.style.transform = "translateY(8px)";
      setTimeout(() => node.remove(), 220);
    }, timeout);
  }

  async function api(path, options = {}) {
    const res = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      credentials: "include",
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      // ignore
    }

    if (!res.ok) {
      const msg = data && data.message ? data.message : `Request failed (${res.status})`;
      const err = new Error(msg);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  async function getMe() {
    const data = await api("/api/auth/me", { method: "GET" });
    return data.user;
  }

  async function login(username, password) {
    return api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async function logout() {
    return api("/api/auth/logout", { method: "POST" });
  }

  // Modal helpers (used on feed page)
  function setupLoginModal({ onLoggedIn } = {}) {
    const overlay = document.getElementById("loginOverlay");
    const openBtn = document.getElementById("loginBtn");
    const heroBtn = document.getElementById("heroLoginBtn");
    const closeBtn = document.getElementById("closeLogin");
    const form = document.getElementById("loginForm");
    const fillDemo = document.getElementById("fillDemo");
    const help = document.getElementById("loginHelp");

    const username = document.getElementById("username");
    const password = document.getElementById("password");

    if (!overlay || !openBtn || !form || !username || !password) return;

    const open = () => {
      overlay.setAttribute("aria-hidden", "false");
      help.textContent = "";
      username.focus();
    };
    const close = () => {
      overlay.setAttribute("aria-hidden", "true");
    };

    openBtn.addEventListener("click", open);
    if (heroBtn) heroBtn.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    if (fillDemo) {
      fillDemo.addEventListener("click", () => {
        username.value = "admin";
        password.value = "admin123";
        help.textContent = "Demo credentials filled.";
      });
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      help.textContent = "";

      const u = username.value.trim();
      const p = password.value;
      if (!u || !p) {
        help.textContent = "Please enter username and password.";
        toast({ title: "Missing fields", message: "Username and password are required.", type: "bad" });
        return;
      }

      const submitBtn = document.getElementById("loginSubmit");
      if (submitBtn) submitBtn.disabled = true;
      try {
        await login(u, p);
        toast({ title: "Welcome back", message: "Login successful.", type: "ok" });
        close();
        if (typeof onLoggedIn === "function") onLoggedIn();
      } catch (err) {
        toast({ title: "Login failed", message: err.message, type: "bad" });
        help.textContent = err.message;
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });

    return { open, close };
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function excerpt(content, max = 180) {
    const clean = String(content || "").trim().replace(/\s+/g, " ");
    if (clean.length <= max) return clean;
    return `${clean.slice(0, max - 1)}…`;
  }

  window.BlogApp = {
    api,
    toast,
    getMe,
    login,
    logout,
    setupLoginModal,
    formatDate,
    escapeHtml,
    excerpt,
  };
})();

