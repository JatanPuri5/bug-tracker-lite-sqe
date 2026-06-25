# Bug Tracker Lite — Project Overview

## Subject
Software Quality Engineering and Testing (SQE)

## Purpose
A lightweight full-stack bug tracking application built to demonstrate software testing practices including unit, integration, and end-to-end testing using real-world tools.

---

## Architecture

```
Client (React + Vite)  →  Server (Express)  →  Database (MongoDB)
     :3000                     :5000                 :27017
```

---

## Features

| Feature              | Description                                      |
|----------------------|--------------------------------------------------|
| Create Bug           | Submit a bug with title, description, severity   |
| View Bugs            | See all bugs in a card-based list                |
| Update Status        | Change status: Open → In Progress → Resolved     |
| Filter Bugs          | Filter by Severity or Status using dropdowns     |
| Delete Bug           | Remove a bug permanently                         |

---

## API Endpoints

| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | /api/bugs         | Fetch all bugs (filterable by `?severity=&status=`) |
| POST   | /api/bugs         | Create a new bug         |
| PATCH  | /api/bugs/:id     | Update a bug's fields    |
| DELETE | /api/bugs/:id     | Delete a bug by ID       |

---

## Data Model

```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "severity": "Low | Medium | High | Critical",
  "status": "Open | In Progress | Resolved",
  "createdAt": "ISO Date"
}
```

---

## Testing Strategy

### Tools Used
- **Playwright** — End-to-End browser automation testing

### Test Cases (TC-01 to TC-12)

| ID    | Test Case                                     | Type |
|-------|-----------------------------------------------|------|
| TC-01 | Page loads with correct title                 | E2E  |
| TC-02 | Bug creation form is visible                  | E2E  |
| TC-03 | Create a new bug successfully                 | E2E  |
| TC-04 | Show validation error when title is empty     | E2E  |
| TC-05 | Default status is Open after creation         | E2E  |
| TC-06 | Update bug status to In Progress              | E2E  |
| TC-07 | Update bug status to Resolved                 | E2E  |
| TC-08 | Delete a bug from the list                    | E2E  |
| TC-09 | Filter bugs by severity                       | E2E  |
| TC-10 | Filter bugs by status                         | E2E  |
| TC-11 | Reset filters and show all bugs               | E2E  |
| TC-12 | Bug count reflects number of bugs             | E2E  |

---

## Folder Structure

```
bug-tracker-lite-sqe/
├── client/              # React + Vite frontend
│   ├── src/
│   │   ├── components/  # BugForm, BugList, BugFilters
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   └── vite.config.js
├── server/              # Node.js + Express backend
│   ├── models/Bug.js
│   ├── routes/bugs.js
│   ├── server.js
│   └── Dockerfile
├── tests/               # Playwright E2E tests
│   └── bugs.spec.ts
├── docs/                # Project documentation
├── scripts/             # Utility scripts (seed data)
├── docker-compose.yml
├── playwright.config.ts
└── README.md
```

---

## Docker Setup
The project uses Docker Compose with three services:
- **mongo** — MongoDB 7 database
- **server** — Express API
- **client** — React app served via Nginx

---

## Student Notes
- All interactive elements have `data-testid` attributes for Playwright selectors
- The backend validates that the bug title is not empty
- Severity badges are color-coded: Green (Low) → Yellow (Medium) → Orange (High) → Red (Critical)
