(() => {
  const { api, toast, getMe, logout, formatDate, escapeHtml, excerpt } = window.BlogApp || {};
  if (!api) return;

  const whoami = document.getElementById("whoami");
  const logoutBtn = document.getElementById("logoutBtn");

  const editorForm = document.getElementById("editorForm");
  const postId = document.getElementById("postId");
  const title = document.getElementById("title");
  const content = document.getElementById("content");
  const publishBtn = document.getElementById("publishBtn");
  const clearBtn = document.getElementById("clearBtn");
  const editorHelp = document.getElementById("editorHelp");

  const mineList = document.getElementById("mineList");
  const mineEmpty = document.getElementById("mineEmpty");
  const refreshMine = document.getElementById("refreshMine");

  function setMode(mode) {
    if (!publishBtn) return;
    publishBtn.textContent = mode === "edit" ? "Update" : "Publish";
  }

  function resetEditor() {
    if (postId) postId.value = "";
    if (title) title.value = "";
    if (content) content.value = "";
    if (editorHelp) editorHelp.textContent = "";
    setMode("new");
  }

  function validateEditor() {
    const t = title.value.trim();
    const c = content.value.trim();
    const errors = [];
    if (t.length < 3) errors.push("Title must be at least 3 characters.");
    if (c.length < 20) errors.push("Content must be at least 20 characters.");
    if (t.length > 120) errors.push("Title must be under 120 characters.");
    if (c.length > 20000) errors.push("Content is too long.");
    return { ok: errors.length === 0, errors, t, c };
  }

  async function loadMine() {
    mineList.innerHTML = "";
    mineEmpty.hidden = true;

    const loading = document.createElement("div");
    loading.className = "empty";
    loading.textContent = "Loading your posts…";
    mineList.appendChild(loading);

    try {
      const data = await api("/api/posts/mine", { method: "GET" });
      const posts = data.posts || [];
      mineList.innerHTML = "";

      if (!posts.length) {
        mineEmpty.hidden = false;
        return;
      }

      const frag = document.createDocumentFragment();
      posts.forEach((p, idx) => {
        const created = p.createdAt ? formatDate(p.createdAt) : "";
        const updated = p.updatedAt ? formatDate(p.updatedAt) : "";
        const card = document.createElement("div");
        card.className = "mini";
        card.style.animationDelay = `${Math.min(idx * 25, 220)}ms`;
        card.innerHTML = `
          <h3 class="mini__title">${escapeHtml(p.title || "Untitled")}</h3>
          <p class="mini__meta">
            <span class="badge">Created ${escapeHtml(created)}</span>
            <span class="badge">Updated ${escapeHtml(updated)}</span>
          </p>
          <p class="card__excerpt" style="margin-top:10px">${escapeHtml(excerpt(p.content || "", 140))}</p>
          <div class="mini__btns">
            <button class="btn-sm btn-sm--primary" data-action="edit" data-id="${escapeHtml(p.id)}">Edit</button>
            <button class="btn-sm btn-sm--danger" data-action="delete" data-id="${escapeHtml(p.id)}">Delete</button>
          </div>
        `;
        frag.appendChild(card);
      });

      mineList.appendChild(frag);
    } catch (err) {
      mineList.innerHTML = "";
      mineEmpty.hidden = false;
      mineEmpty.textContent = "Could not load your posts. Please try again.";
      toast({ title: "Load failed", message: err.message, type: "bad" });
    }
  }

  async function initAuthGuard() {
    try {
      const user = await getMe();
      if (!user) {
        window.location.href = "/?login=1";
        return null;
      }
      if (whoami) whoami.textContent = `Logged in as: ${user.username}`;
      return user;
    } catch {
      window.location.href = "/?login=1";
      return null;
    }
  }

  function wireLogout() {
    if (!logoutBtn) return;
    logoutBtn.addEventListener("click", async () => {
      logoutBtn.disabled = true;
      try {
        await logout();
        toast({ title: "Logged out", message: "Redirecting to feed…", type: "ok" });
        setTimeout(() => (window.location.href = "/"), 600);
      } catch (err) {
        toast({ title: "Logout failed", message: err.message, type: "bad" });
      } finally {
        logoutBtn.disabled = false;
      }
    });
  }

  function wireEditor() {
    if (!editorForm) return;
    editorForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (editorHelp) editorHelp.textContent = "";

      const v = validateEditor();
      if (!v.ok) {
        const msg = v.errors[0];
        if (editorHelp) editorHelp.textContent = msg;
        toast({ title: "Fix required", message: msg, type: "bad" });
        return;
      }

      publishBtn.disabled = true;
      try {
        const id = postId.value;
        if (!id) {
          await api("/api/posts", { method: "POST", body: JSON.stringify({ title: v.t, content: v.c }) });
          toast({ title: "Published", message: "Your post is live in the feed.", type: "ok" });
          resetEditor();
        } else {
          await api(`/api/posts/${encodeURIComponent(id)}`, {
            method: "PUT",
            body: JSON.stringify({ title: v.t, content: v.c }),
          });
          toast({ title: "Updated", message: "Changes saved.", type: "ok" });
          resetEditor();
        }
        await loadMine();
      } catch (err) {
        toast({ title: "Save failed", message: err.message, type: "bad" });
        if (editorHelp) editorHelp.textContent = err.message;
      } finally {
        publishBtn.disabled = false;
      }
    });

    if (clearBtn) clearBtn.addEventListener("click", resetEditor);
  }

  function wireMineActions() {
    if (!mineList) return;
    mineList.addEventListener("click", async (e) => {
      const btn = e.target && e.target.closest ? e.target.closest("button[data-action]") : null;
      if (!btn) return;
      const action = btn.getAttribute("data-action");
      const id = btn.getAttribute("data-id");
      if (!id) return;

      if (action === "edit") {
        // Fetch mine list again to get the full content; simple approach for beginners
        try {
          const data = await api("/api/posts/mine", { method: "GET" });
          const post = (data.posts || []).find((p) => p.id === id);
          if (!post) return toast({ title: "Not found", message: "Post no longer exists.", type: "bad" });

          postId.value = post.id;
          title.value = post.title || "";
          content.value = post.content || "";
          setMode("edit");
          toast({ title: "Edit mode", message: "Update the fields and click “Update”.", type: "ok" });
          title.focus();
        } catch (err) {
          toast({ title: "Edit failed", message: err.message, type: "bad" });
        }
      }

      if (action === "delete") {
        const ok = window.confirm("Delete this post? This cannot be undone.");
        if (!ok) return;
        btn.disabled = true;
        try {
          await api(`/api/posts/${encodeURIComponent(id)}`, { method: "DELETE" });
          toast({ title: "Deleted", message: "Post removed.", type: "ok" });
          await loadMine();
        } catch (err) {
          toast({ title: "Delete failed", message: err.message, type: "bad" });
        } finally {
          btn.disabled = false;
        }
      }
    });
  }

  (async () => {
    const user = await initAuthGuard();
    if (!user) return;
    wireLogout();
    wireEditor();
    wireMineActions();
    if (refreshMine) refreshMine.addEventListener("click", loadMine);
    resetEditor();
    await loadMine();
  })();
})();

