# To-Do List Life Dashboard

## Project Overview
This is a **To-Do List Life Dashboard** built as part of the RevoU Coding Camp assignment.
It is a static web application built with plain HTML, CSS, and Vanilla JavaScript — no frameworks.

## Tech Stack
- **HTML** — page structure (`index.html`)
- **CSS** — styling (`css/style.css`)
- **JavaScript** — all interactivity (`js/script.js`)
- **LocalStorage** — client-side data persistence (no backend)

## Folder Structure
```
index.html
css/
  style.css
js/
  script.js
.kiro/
  steering/
    project.md
```

## Features
### MVP
- **Greeting** — real-time clock, date, and time-based greeting (Morning / Afternoon / Evening / Night)
- **Focus Timer** — 25-minute countdown with Start, Stop, Reset
- **To-Do List** — add, edit, mark done, delete; saved to LocalStorage
- **Quick Links** — custom bookmark buttons; saved to LocalStorage

### Challenges (3 chosen)
1. **Custom name in greeting** — user can set their name, saved to LocalStorage
2. **Change Pomodoro time** — user can set custom timer duration, saved to LocalStorage
3. **Prevent duplicate tasks** — case-insensitive duplicate check on add and edit

### Bonus
- Light / Dark mode toggle (saved to LocalStorage)
- Sort tasks (A→Z, Z→A, Done Last)
- Toast notifications for user feedback

## Constraints
- TC-1: HTML + CSS + Vanilla JS only (no React, Vue, etc.)
- TC-2: All data stored in browser LocalStorage
- TC-3: Works in Chrome, Firefox, Edge, Safari
