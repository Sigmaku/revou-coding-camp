/* =========================================
   LIFE DASHBOARD — script.js
   Vanilla JS only. No frameworks.
   ========================================= */

// =========================================
// GREETING — Clock, Date & Custom Name
// =========================================

const clockEl    = document.getElementById('clock');
const dateEl     = document.getElementById('date');
const greetingEl = document.getElementById('greeting');
const greetingNameEl = document.getElementById('greeting-name');
const btnEditName    = document.getElementById('btn-edit-name');
const nameModal      = document.getElementById('name-modal');
const inputName      = document.getElementById('input-name');
const btnSaveName    = document.getElementById('btn-save-name');
const btnCancelName  = document.getElementById('btn-cancel-name');

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

function updateClock() {
  const now  = new Date();
  const hh   = String(now.getHours()).padStart(2, '0');
  const mm   = String(now.getMinutes()).padStart(2, '0');
  const ss   = String(now.getSeconds()).padStart(2, '0');
  clockEl.textContent = `${hh}:${mm}:${ss}`;

  const day   = DAYS[now.getDay()];
  const date  = now.getDate();
  const month = MONTHS[now.getMonth()];
  const year  = now.getFullYear();
  dateEl.textContent = `${day}, ${month} ${date}, ${year}`;

  const hour = now.getHours();
  let greet;
  if (hour >= 5 && hour < 12)      greet = 'Good Morning';
  else if (hour >= 12 && hour < 15) greet = 'Good Afternoon';
  else if (hour >= 15 && hour < 19) greet = 'Good Evening';
  else                               greet = 'Good Night';

  // Challenge: Custom name
  const savedName = localStorage.getItem('userName');
  greetingEl.textContent = greet;
  greetingNameEl.textContent = savedName ? `👋 Hello, ${savedName}!` : '';
}

setInterval(updateClock, 1000);
updateClock();

// Open name modal
btnEditName.addEventListener('click', () => {
  inputName.value = localStorage.getItem('userName') || '';
  nameModal.classList.remove('hidden');
  inputName.focus();
});

// Save name
btnSaveName.addEventListener('click', saveName);
inputName.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') saveName();
  if (e.key === 'Escape') closeNameModal();
});

function saveName() {
  const name = inputName.value.trim();
  if (name) {
    localStorage.setItem('userName', name);
  } else {
    localStorage.removeItem('userName');
  }
  closeNameModal();
  updateClock();
  showToast(name ? `Name set to "${name}"` : 'Name removed');
}

function closeNameModal() {
  nameModal.classList.add('hidden');
}

btnCancelName.addEventListener('click', closeNameModal);

// Close modal by clicking backdrop
nameModal.addEventListener('click', (e) => {
  if (e.target === nameModal) closeNameModal();
});

// =========================================
// FOCUS TIMER
// =========================================

const timerDisplay   = document.getElementById('timer-display');
const btnStart       = document.getElementById('btn-start');
const btnStop        = document.getElementById('btn-stop');
const btnReset       = document.getElementById('btn-reset');
const timerDurationInput = document.getElementById('timer-duration');
const btnSetDuration     = document.getElementById('btn-set-duration');

// Load saved duration or default to 25 minutes
let timerDuration = parseInt(localStorage.getItem('timerDuration')) || 25;
let timeLeft      = timerDuration * 60; // in seconds
let timerInterval = null;
let timerRunning  = false;

// Sync duration input with saved value
timerDurationInput.value = timerDuration;

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function renderTimer() {
  timerDisplay.textContent = formatTime(timeLeft);
}

renderTimer();

btnStart.addEventListener('click', () => {
  if (timerRunning) return;
  timerRunning = true;
  timerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      showToast('⏰ Focus session complete! Take a break.');
      return;
    }
    timeLeft--;
    renderTimer();
  }, 1000);
});

btnStop.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerRunning = false;
});

btnReset.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerRunning = false;
  timeLeft = timerDuration * 60;
  renderTimer();
});

// Challenge: Change Pomodoro time
btnSetDuration.addEventListener('click', setDuration);
timerDurationInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') setDuration();
});

function setDuration() {
  const val = parseInt(timerDurationInput.value);
  if (isNaN(val) || val < 1 || val > 120) {
    showToast('Please enter a duration between 1 and 120 minutes.');
    return;
  }
  // Stop any running timer first
  clearInterval(timerInterval);
  timerRunning  = false;
  timerDuration = val;
  timeLeft      = timerDuration * 60;
  localStorage.setItem('timerDuration', timerDuration);
  renderTimer();
  showToast(`Timer set to ${timerDuration} minute${timerDuration > 1 ? 's' : ''}`);
}

// =========================================
// TO-DO LIST
// =========================================

const inputTask  = document.getElementById('input-task');
const btnAddTask = document.getElementById('btn-add-task');
const taskListEl = document.getElementById('task-list');
const emptyTasks = document.getElementById('empty-tasks');

// Load tasks from LocalStorage
function loadTasks() {
  const raw = localStorage.getItem('tasks');
  return raw ? JSON.parse(raw) : [];
}

// Save tasks to LocalStorage
function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Generate a simple unique ID
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// Render task list
function renderTasks() {
  const tasks  = loadTasks();

  taskListEl.innerHTML = '';

  if (tasks.length === 0) {
    emptyTasks.classList.remove('hidden');
    return;
  }
  emptyTasks.classList.add('hidden');

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type      = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked   = task.done;
    checkbox.setAttribute('aria-label', `Mark "${task.text}" as done`);
    checkbox.addEventListener('change', () => toggleTask(task.id));

    // Task text span
    const span = document.createElement('span');
    span.className = task.done ? 'task-text done' : 'task-text';
    span.textContent = task.text;

    // Action buttons
    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-task btn-task-edit';
    editBtn.textContent = 'Edit';
    editBtn.setAttribute('aria-label', `Edit task "${task.text}"`);
    editBtn.addEventListener('click', () => startEditTask(task.id, li, task.text));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-task btn-task-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('aria-label', `Delete task "${task.text}"`);
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(actions);
    taskListEl.appendChild(li);
  });
}

// Add task
function addTask() {
  const text = inputTask.value.trim();
  if (!text) {
    showToast('Please enter a task.');
    return;
  }

  // Challenge: Prevent duplicate tasks (case-insensitive)
  const tasks = loadTasks();
  const duplicate = tasks.some(
    (t) => t.text.toLowerCase() === text.toLowerCase()
  );
  if (duplicate) {
    showToast(`Task "${text}" already exists!`);
    return;
  }

  tasks.push({ id: uid(), text, done: false });
  saveTasks(tasks);
  inputTask.value = '';
  renderTasks();
}

btnAddTask.addEventListener('click', addTask);
inputTask.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

// Toggle done
function toggleTask(id) {
  const tasks = loadTasks();
  const task  = tasks.find((t) => t.id === id);
  if (task) {
    task.done = !task.done;
    saveTasks(tasks);
    renderTasks();
  }
}

// Delete task
function deleteTask(id) {
  let tasks = loadTasks();
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks(tasks);
  renderTasks();
  showToast('Task deleted.');
}

// Start editing a task (inline edit)
function startEditTask(id, li, currentText) {
  // Replace span + edit btn with an input + save btn
  li.innerHTML = '';

  const checkbox = document.createElement('input');
  checkbox.type      = 'checkbox';
  checkbox.className = 'task-checkbox';
  const task = loadTasks().find((t) => t.id === id);
  checkbox.checked   = task ? task.done : false;
  checkbox.addEventListener('change', () => toggleTask(id));

  const editInput = document.createElement('input');
  editInput.type      = 'text';
  editInput.className = 'task-edit-input';
  editInput.value     = currentText;
  editInput.maxLength = 100;

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const saveBtn = document.createElement('button');
  saveBtn.className   = 'btn-task btn-task-save';
  saveBtn.textContent = 'Save';
  saveBtn.addEventListener('click', () => saveEditTask(id, editInput.value));

  const cancelBtn = document.createElement('button');
  cancelBtn.className   = 'btn-task btn-task-edit';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', renderTasks);

  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  saveEditTask(id, editInput.value);
    if (e.key === 'Escape') renderTasks();
  });

  actions.appendChild(saveBtn);
  actions.appendChild(cancelBtn);

  li.appendChild(checkbox);
  li.appendChild(editInput);
  li.appendChild(actions);

  editInput.focus();
  editInput.select();
}

function saveEditTask(id, newText) {
  newText = newText.trim();
  if (!newText) {
    showToast('Task cannot be empty.');
    return;
  }

  const tasks = loadTasks();

  // Challenge: Prevent duplicate on edit (exclude own id)
  const duplicate = tasks.some(
    (t) => t.id !== id && t.text.toLowerCase() === newText.toLowerCase()
  );
  if (duplicate) {
    showToast(`Task "${newText}" already exists!`);
    return;
  }

  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.text = newText;
    saveTasks(tasks);
    renderTasks();
  }
}

// Initial render
renderTasks();

// =========================================
// QUICK LINKS
// =========================================

const inputLinkName = document.getElementById('input-link-name');
const inputLinkUrl  = document.getElementById('input-link-url');
const btnAddLink    = document.getElementById('btn-add-link');
const linksListEl   = document.getElementById('links-list');
const emptyLinks    = document.getElementById('empty-links');

function loadLinks() {
  const raw = localStorage.getItem('quickLinks');
  return raw ? JSON.parse(raw) : [];
}

function saveLinks(links) {
  localStorage.setItem('quickLinks', JSON.stringify(links));
}

function renderLinks() {
  const links = loadLinks();
  linksListEl.innerHTML = '';

  if (links.length === 0) {
    emptyLinks.classList.remove('hidden');
    return;
  }
  emptyLinks.classList.add('hidden');

  links.forEach((link) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'link-item';

    const anchor = document.createElement('a');
    anchor.className = 'link-btn';
    anchor.textContent = link.name;
    anchor.href        = link.url;
    anchor.target      = '_blank';
    anchor.rel         = 'noopener noreferrer';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'link-delete-btn';
    deleteBtn.textContent = '✕';
    deleteBtn.setAttribute('aria-label', `Remove link "${link.name}"`);
    deleteBtn.addEventListener('click', () => deleteLink(link.id));

    wrapper.appendChild(anchor);
    wrapper.appendChild(deleteBtn);
    linksListEl.appendChild(wrapper);
  });
}

function addLink() {
  const name = inputLinkName.value.trim();
  let   url  = inputLinkUrl.value.trim();

  if (!name || !url) {
    showToast('Please enter both a name and a URL.');
    return;
  }

  // Auto-prepend https:// if missing
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  // Basic URL validation
  try {
    new URL(url);
  } catch {
    showToast('Please enter a valid URL.');
    return;
  }

  const links = loadLinks();
  links.push({ id: uid(), name, url });
  saveLinks(links);
  inputLinkName.value = '';
  inputLinkUrl.value  = '';
  renderLinks();
}

btnAddLink.addEventListener('click', addLink);
inputLinkUrl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addLink();
});

function deleteLink(id) {
  let links = loadLinks();
  links = links.filter((l) => l.id !== id);
  saveLinks(links);
  renderLinks();
  showToast('Link removed.');
}

renderLinks();

// =========================================
// TOAST NOTIFICATION
// =========================================

let toastTimeout;

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id        = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
}
