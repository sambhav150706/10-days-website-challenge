// Minimal To‑Do / Notes app
// Handles: add, edit, delete, toggle complete, and persist to localStorage.

// Key used for localStorage
const STORAGE_KEY = "minimal_todo_tasks_v1";

// DOM references
const taskForm = document.getElementById("taskForm");
const taskTitleInput = document.getElementById("taskTitle");
const taskDetailsInput = document.getElementById("taskDetails");
const taskListEl = document.getElementById("taskList");
const emptyStateEl = document.getElementById("emptyState");
const submitLabelEl = document.getElementById("submitLabel");
const currentDateEl = document.getElementById("currentDate");

// In‑memory state
let tasks = [];
let editingId = null; // if non‑null, form is editing an existing task

// ============================
// Utilities
// ============================

/**
 * Generate a simple unique id for tasks.
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Save current tasks array to localStorage.
 */
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error("Failed to save tasks:", err);
  }
}

/**
 * Load tasks from localStorage into memory.
 */
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (err) {
    console.error("Failed to load tasks:", err);
    return [];
  }
}

/**
 * Format date/time for display.
 */
function formatTimestamp(ts) {
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Render current date in header.
 */
function renderCurrentDate() {
  if (!currentDateEl) return;
  const now = new Date();
  currentDateEl.textContent = now.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// ============================
// Rendering
// ============================

/**
 * Clear all children from a node.
 */
function clearChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

/**
 * Show or hide the empty‑state section based on current tasks.
 */
function updateEmptyStateVisibility() {
  if (!emptyStateEl) return;
  const hasTasks = tasks.length > 0;
  if (hasTasks) {
    emptyStateEl.classList.add("hidden");
  } else {
    emptyStateEl.classList.remove("hidden");
  }
}

/**
 * Create a single task list item element.
 */
function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task-item";
  if (task.completed) {
    li.classList.add("completed");
  }
  // for enter animation
  requestAnimationFrame(() => li.classList.add("enter"));

  // Checkbox
  const checkboxWrapper = document.createElement("div");
  checkboxWrapper.className = "checkbox-wrapper";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  checkbox.checked = !!task.completed;
  checkbox.setAttribute("aria-label", "Toggle task completion");
  checkbox.addEventListener("change", () => {
    toggleTaskCompleted(task.id);
  });

  checkboxWrapper.appendChild(checkbox);

  // Main content (title + details + meta)
  const main = document.createElement("div");
  main.className = "task-main";

  const titleEl = document.createElement("h3");
  titleEl.className = "task-title";
  titleEl.textContent = task.title;

  const detailsEl = document.createElement("p");
  detailsEl.className = "task-details";
  detailsEl.textContent = task.details || "";
  if (!task.details) {
    detailsEl.classList.add("hidden");
  }

  const metaEl = document.createElement("div");
  metaEl.className = "task-meta";
  const createdText = `Created ${formatTimestamp(task.createdAt)}`;
  const statusText = task.completed
    ? task.completedAt
      ? ` • Completed ${formatTimestamp(task.completedAt)}`
      : " • Completed"
    : "";
  metaEl.textContent = createdText + statusText;

  main.appendChild(titleEl);
  main.appendChild(detailsEl);
  main.appendChild(metaEl);

  // Actions (edit / delete)
  const actions = document.createElement("div");
  actions.className = "task-actions";

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "icon-btn";
  editBtn.setAttribute("aria-label", "Edit task");
  editBtn.innerHTML = '<span class="icon">✏️</span>';
  editBtn.addEventListener("click", () => {
    beginEditTask(task.id);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "icon-btn icon-btn--danger";
  deleteBtn.setAttribute("aria-label", "Delete task");
  deleteBtn.innerHTML = '<span class="icon">✕</span>';
  deleteBtn.addEventListener("click", () => {
    removeTask(task.id, li);
  });

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(checkboxWrapper);
  li.appendChild(main);
  li.appendChild(actions);

  return li;
}

/**
 * Re-render the entire list of tasks.
 * For this simple app, full re-rendering is fine and keeps code clear.
 */
function renderTasks() {
  clearChildren(taskListEl);
  tasks.forEach((task) => {
    const li = createTaskElement(task);
    taskListEl.appendChild(li);
  });
  updateEmptyStateVisibility();
}

// ============================
// Task manipulation
// ============================

/**
 * Add a new task to state and UI.
 */
function addTask(title, details) {
  const trimmedTitle = title.trim();
  const trimmedDetails = details.trim();
  if (!trimmedTitle) return;

  const newTask = {
    id: generateId(),
    title: trimmedTitle,
    details: trimmedDetails,
    completed: false,
    createdAt: Date.now(),
    completedAt: null,
  };

  // Add newest tasks at top
  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
}

/**
 * Begin editing a task: populate the form and switch button label.
 */
function beginEditTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  editingId = id;
  taskTitleInput.value = task.title;
  taskDetailsInput.value = task.details || "";
  submitLabelEl.textContent = "Save";
  taskTitleInput.focus();
}

/**
 * Apply edits to the currently edited task.
 */
function saveEditedTask(title, details) {
  if (!editingId) return;
  const trimmedTitle = title.trim();
  const trimmedDetails = details.trim();
  if (!trimmedTitle) return;

  const idx = tasks.findIndex((t) => t.id === editingId);
  if (idx === -1) return;

  tasks[idx] = {
    ...tasks[idx],
    title: trimmedTitle,
    details: trimmedDetails,
  };

  editingId = null;
  submitLabelEl.textContent = "Add";
  saveTasks();
  renderTasks();
}

/**
 * Toggle a task's completed state.
 */
function toggleTaskCompleted(id) {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return;

  const current = tasks[idx];
  const nowCompleted = !current.completed;

  tasks[idx] = {
    ...current,
    completed: nowCompleted,
    completedAt: nowCompleted ? Date.now() : null,
  };

  saveTasks();
  renderTasks();
}

/**
 * Remove a task from the list with a small exit animation.
 */
function removeTask(id, listItemEl) {
  // Optional: soft animation before removal
  if (listItemEl) {
    listItemEl.classList.add("exit");
    setTimeout(() => {
      tasks = tasks.filter((t) => t.id !== id);
      saveTasks();
      renderTasks();
    }, 140);
  } else {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    renderTasks();
  }
}

/**
 * Reset the form back to "add" mode.
 */
function resetForm() {
  taskForm.reset();
  editingId = null;
  submitLabelEl.textContent = "Add";
}

// ============================
// Event listeners
// ============================

if (taskForm) {
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = taskTitleInput.value;
    const details = taskDetailsInput.value;

    if (!title.trim()) {
      taskTitleInput.focus();
      return;
    }

    if (editingId) {
      saveEditedTask(title, details);
    } else {
      addTask(title, details);
    }

    resetForm();
  });
}

// ============================
// Initialisation
// ============================

function init() {
  renderCurrentDate();
  tasks = loadTasks();
  renderTasks();
}

// Run on DOMContentLoaded to be safe
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

