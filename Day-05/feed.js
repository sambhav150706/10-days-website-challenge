(() => {
  const { api, toast, setupLoginModal, getMe, formatDate, escapeHtml, excerpt } = window.BlogApp || {};
  if (!api) return;

  const feed = document.getElementById("feed");
  const empty = document.getElementById("empty");
  const refreshBtn = document.getElementById("refreshBtn");
  const totalPosts = document.getElementById("totalPosts");
  const whoami = document.getElementById("whoami");

  const dashboardLink = document.getElementById("dashboardLink");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  function setAuthUi(user) {
    if (whoami) whoami.textContent = user ? user.username : "Guest";
    if (loginBtn) loginBtn.hidden = Boolean(user);
    if (logoutBtn) logoutBtn.hidden = !user;
    if (dashboardLink) dashboardLink.textContent = user ? "Dashboard" : "Dashboard (Login required)";
  }

  async function refreshMe() {
    try {
      const user = await getMe();
      setAuthUi(user);
      return user;
    } catch {
      setAuthUi(null);
      return null;
    }
  }

  function renderPosts(posts) {
    feed.innerHTML = "";
    if (totalPosts) totalPosts.textContent = String(posts.length);

    if (!posts.length) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    const frag = document.createDocumentFragment();
    posts.forEach((p, idx) => {
      const created = p.createdAt ? formatDate(p.createdAt) : "";
      const author = p.author ? escapeHtml(p.author) : "Unknown";
      const title = escapeHtml(p.title || "Untitled");
      const ex = escapeHtml(excerpt(p.content || ""));
      const card = document.createElement("article");
      card.className = "card";
      card.style.animationDelay = `${Math.min(idx * 30, 240)}ms`;
      card.innerHTML = `
        <div class="card__body">
          <h3 class="card__title">${title}</h3>
          <div class="card__meta">
            <span class="badge">By ${author}</span>
            <span class="badge">${escapeHtml(created)}</span>
          </div>
          <p class="card__excerpt">${ex}</p>
        </div>
      `;
      frag.appendChild(card);
    });
    feed.appendChild(frag);
  }

  async function loadFeed() {
    if (!feed) return;
    feed.innerHTML = "";
    empty.hidden = true;
    const skeleton = document.createElement("div");
    skeleton.className = "empty";
    skeleton.textContent = "Loading posts…";
    feed.appendChild(skeleton);

    try {
      const data = await api("/api/posts", { method: "GET" });
      renderPosts(data.posts || []);
    } catch (err) {
      feed.innerHTML = "";
      empty.hidden = false;
      empty.textContent = "Could not load posts. Is the server running?";
      toast({ title: "Load failed", message: err.message, type: "bad" });
      if (totalPosts) totalPosts.textContent = "—";
    }
  }

  function wireLogout() {
    if (!logoutBtn) return;
    logoutBtn.addEventListener("click", async () => {
      logoutBtn.disabled = true;
      try {
        await window.BlogApp.logout();
        toast({ title: "Logged out", message: "See you next time.", type: "ok" });
        await refreshMe();
      } catch (err) {
        toast({ title: "Logout failed", message: err.message, type: "bad" });
      } finally {
        logoutBtn.disabled = false;
      }
    });
  }

  // Init
  const loginModal = setupLoginModal({
    onLoggedIn: async () => {
      await refreshMe();
      await loadFeed();
    },
  }) || {};

  if (refreshBtn) refreshBtn.addEventListener("click", loadFeed);
  wireLogout();

  // If someone hit /?login=1
  const params = new URLSearchParams(location.search);
  const wantLogin = params.get("login") === "1";

  (async () => {
    await refreshMe();
    await loadFeed();
    if (wantLogin) {
      if (typeof loginModal.open === "function") loginModal.open();
    }
  })();
})();

