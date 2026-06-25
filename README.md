# Bug Tracker Lite

A lightweight full-stack bug tracking application built for **Software Quality Engineering and Testing (SQE)**.

**Tech Stack:** React + Vite | Node.js + Express | MongoDB | Playwright | Docker

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- MongoDB running locally on port `27017`
- npm

### 1. Clone / Open the Project

```bash
cd bug-tracker-lite-sqe
```

### 2. Copy Environment Variables

```bash
copy .env.example server\.env
```

> Edit `server\.env` if your MongoDB URI is different.

### 3. Install All Dependencies

```bash
# Root (Playwright + concurrently)
npm install

# Backend
npm install --prefix server

# Frontend
npm install --prefix client
```

### 4. Run the App (Frontend + Backend Together)

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/bugs

---

## Run with Docker (Recommended for Full Stack)

### Prerequisites
- Docker Desktop installed and running

```bash
docker-compose up --build
```

- App: http://localhost:3000
- API: http://localhost:5000/api/bugs

To stop:
```bash
docker-compose down
```

---

## Seed Sample Data

```bash
node scripts/seed.js
```

---

## Run Playwright E2E Tests

Make sure the app is running (either locally or Docker), then:

```bash
# Run all tests
npm run test:e2e

# View HTML report after tests
npm run test:report
```

---

## Install Playwright Browsers (First Time Only)

```bash
npx playwright install
```

---

## Project Scripts

| Script              | Description                        |
|---------------------|------------------------------------|
| `npm run dev`       | Start both frontend and backend    |
| `npm run build`     | Build the React frontend           |
| `npm run test:e2e`  | Run all Playwright E2E tests       |
| `npm run test:report` | Open Playwright HTML report      |

---

## API Reference

| Method | Endpoint               | Body / Params                    |
|--------|------------------------|----------------------------------|
| GET    | `/api/bugs`            | `?severity=High&status=Open`     |
| POST   | `/api/bugs`            | `{ title, description, severity }` |
| PATCH  | `/api/bugs/:id`        | `{ status }` or any field        |
| DELETE | `/api/bugs/:id`        | —                                |

---

## Project Structure

```
bug-tracker-lite-sqe/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── BugForm.jsx
│   │   │   ├── BugFilters.jsx
│   │   │   └── BugList.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vite.config.js
├── server/                 # Express API
│   ├── models/Bug.js
│   ├── routes/bugs.js
│   ├── server.js
│   └── Dockerfile
├── tests/
│   └── bugs.spec.ts        # 12 Playwright test cases
├── docs/
│   └── project-overview.md
├── scripts/
│   └── seed.js
├── docker-compose.yml
├── playwright.config.ts
├── .env.example
└── README.md
```

---

## Test Cases Summary

| ID    | Description                              |
|-------|------------------------------------------|
| TC-01 | App title is displayed                   |
| TC-02 | Bug form is visible                      |
| TC-03 | Create a bug successfully                |
| TC-04 | Validation error when title is empty     |
| TC-05 | New bug defaults to Open status          |
| TC-06 | Update status to In Progress             |
| TC-07 | Update status to Resolved                |
| TC-08 | Delete a bug                             |
| TC-09 | Filter bugs by severity                  |
| TC-10 | Filter bugs by status                    |
| TC-11 | Reset filters shows all bugs             |
| TC-12 | Bug count updates correctly              |
