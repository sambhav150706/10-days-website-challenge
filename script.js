(() => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector("#nav-menu");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const yearEl = document.querySelector("#year");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const setMenuOpen = (open) => {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", String(open));
    navMenu.classList.toggle("open", open);
  };

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      setMenuOpen(!expanded);
    });
  }

  // Close menu on link click (mobile)
  navLinks.forEach((a) => {
    a.addEventListener("click", () => setMenuOpen(false));
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenuOpen(false);
  });

  // Active section highlighting
  const sectionIds = ["about", "skills", "projects", "contact"];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const setActiveLink = (id) => {
    navLinks.forEach((a) => {
      const isActive = a.getAttribute("href") === `#${id}`;
      a.classList.toggle("active", isActive);
    });
  };

  if (sections.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveLink(visible.target.id);
      },
      { root: null, threshold: [0.2, 0.35, 0.5, 0.65] }
    );
    sections.forEach((s) => obs.observe(s));
  }

  // Contact form validation + friendly success message (no backend)
  const form = document.getElementById("contact-form");
  const note = document.getElementById("form-note");

  const fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    message: document.getElementById("message"),
  };

  const errorEl = (key) => document.querySelector(`.field-error[data-for="${key}"]`);

  const setError = (key, msg) => {
    const el = errorEl(key);
    if (!el) return;
    el.textContent = msg || "";
  };

  const isEmailValid = (email) => {
    // Simple email check (good UX, not strict RFC)
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  };

  const validate = () => {
    let ok = true;

    const name = (fields.name?.value || "").trim();
    const email = (fields.email?.value || "").trim();
    const message = (fields.message?.value || "").trim();

    if (!name) {
      setError("name", "Please enter your name.");
      ok = false;
    } else {
      setError("name", "");
    }

    if (!email) {
      setError("email", "Please enter your email.");
      ok = false;
    } else if (!isEmailValid(email)) {
      setError("email", "Please enter a valid email address.");
      ok = false;
    } else {
      setError("email", "");
    }

    if (!message) {
      setError("message", "Please write a short message.");
      ok = false;
    } else if (message.length < 10) {
      setError("message", "Please add a bit more detail (10+ characters).");
      ok = false;
    } else {
      setError("message", "");
    }

    return ok;
  };

  if (form) {
    form.addEventListener("input", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (note) note.textContent = "";
      if (target.id === "name") setError("name", "");
      if (target.id === "email") setError("email", "");
      if (target.id === "message") setError("message", "");
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (note) note.textContent = "";

      const ok = validate();
      if (!ok) return;

      const name = (fields.name.value || "").trim();
      if (note) {
        note.textContent = `Thanks, ${name}! Your message is ready. (This demo doesn’t send emails yet.)`;
      }
      form.reset();
      setMenuOpen(false);
    });
  }
})();

