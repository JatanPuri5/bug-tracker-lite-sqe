# Bug Tracker Lite App

A lightweight full-stack bug tracking application built for **Software Quality Engineering and Testing (SQE)**.  
Demonstrates a complete SQE workflow: Jira User Stories → MERN Development → Docker → Playwright Automation → Jira Status Update → GitHub.

---

## Project Overview

Bug Tracker Lite allows teams to report, track, and resolve software bugs. Every bug created in the app automatically creates a linked Jira issue. When a bug is marked **Resolved**, the linked Jira issue is automatically transitioned to **Done**.

**Jira Project:** [KAN — Bug Tracker Lite App](https://jatinpuri108.atlassian.net)  
**GitHub:** [bug-tracker-lite-sqe](https://github.com/JatanPuri5/bug-tracker-lite-sqe.git)

---

## Features

- Report bugs with title, description, and severity (Low / Medium / High / Critical)
- View all bugs in a live list with severity and status badges
- Update bug status (Open → In Progress → Resolved)
- Filter bugs by severity and status
- Delete bugs
- Automatic Jira issue creation on bug report
- Automatic Jira transition to Done when bug is Resolved
- Jira key displayed as a clickable link on each bug card

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | MongoDB 7 (Mongoose) |
| Containerization | Docker + Docker Compose |
| E2E Testing | Playwright |
| Issue Tracking | Atlassian Jira (REST API v3) |
| MCP Integration | Atlassian MCP + Playwright MCP |

---

## SQE Workflow

```
Jira User Stories (KAN)
        ↓
MERN Application Development
        ↓
Docker Compose (mongo + server + client)
        ↓
Playwright E2E Automation (10 test cases)
        ↓
Jira Status Update (KAN-8 to KAN-12 → Done)
        ↓
Result Analysis Report
        ↓
GitHub Push (secrets excluded)
```

---

## Jira Integration

### How it works

1. **Bug Created** → `POST /api/bugs` → MongoDB save → Jira Bug issue created via REST API → `jiraKey` and `jiraUrl` stored in MongoDB
2. **Bug Resolved** → `PATCH /api/bugs/:id` → Jira issue transitioned to **Done** → Comment added automatically
3. **Sync failed** → `jiraSyncStatus: 'FAILED'` shown on bug card as "Jira Sync: Failed"

### Jira Issues in Project KAN

| Key | Type | Title | Status |
|-----|------|-------|--------|
| KAN-2 | Epic | Bug Tracker Lite App | To Do |
| KAN-3 | Story | Create Bug Report | To Do |
| KAN-4 | Story | View Bug List | To Do |
| KAN-5 | Story | Update Bug Status | To Do |
| KAN-6 | Story | Filter Bugs | To Do |
| KAN-7 | Story | Delete Bug | To Do |
| KAN-8 | Task | TC-01 Create Bug Successfully | Done |
| KAN-9 | Task | TC-02 Required Title Validation | Done |
| KAN-10 | Task | TC-03 Update Bug Status | Done |
| KAN-11 | Task | TC-04 Filter Bugs by Severity and Status | Done |
| KAN-12 | Task | TC-05 Delete Bug Successfully | Done |

---

## Environment Variables Setup

### `.env.jira` (project root — never committed)

```env
JIRA_BASE_URL=https://your-site.atlassian.net
JIRA_EMAIL=your@email.com
JIRA_API_TOKEN=your_api_token
JIRA_PROJECT_KEY=KAN
```

Copy from the example:
```bash
copy .env.jira.example .env.jira
```

### `server/.env` (local dev only — never committed)

```env
MONGO_URI=mongodb://localhost:27017/bug-tracker
PORT=5000
```

Copy from the example:
```bash
copy .env.example server\.env
```

> **Security:** `.env.jira` and `server/.env` are in `.gitignore` and are never committed. Jira credentials are only read from environment variables — never hardcoded.

---

## Run with Docker (Recommended)

### Prerequisites
- Docker Desktop installed and running
- `.env.jira` file present in project root

```bash
# Start all containers (mongo + server + client)
docker compose up --build -d

# Check container status
docker compose ps
```

| Container | URL |
|-----------|-----|
| client (React app) | http://localhost:3000 |
| server (API) | http://localhost:5000/api/bugs |
| mongo | localhost:27017 |

```bash
# Stop containers
docker compose down
```

---

## Run Locally (Without Docker)

### Prerequisites
- Node.js 20+
- MongoDB running locally on port `27017`

```bash
# Install all dependencies
npm install
npm install --prefix server
npm install --prefix client

# Start both frontend and backend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/bugs

---

## Run Playwright E2E Tests

Ensure the app is running (Docker or local), then:

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run all 10 test cases
npm run test:e2e

# View HTML report after tests
npm run test:report
```

### Test Cases

| Jira Key | Test | Description |
|----------|------|-------------|
| KAN-8 | TC-01 | Create Bug Successfully |
| KAN-9 | TC-02 | Required Title Validation |
| KAN-10 | TC-03 | Update Bug Status |
| KAN-11 | TC-04 | Filter Bugs by Severity and Status |
| KAN-12 | TC-05 | Delete Bug Successfully |
| KAN-13 | TC-06 | Page Loads with Title and Empty State |
| KAN-14 | TC-07 | Bug Count Updates as Bugs Are Added |
| KAN-15 | TC-08 | Form Resets After Successful Submission |
| KAN-16 | TC-09 | Bug Description Is Displayed on Card |
| KAN-17 | TC-10 | Filter by Severity and Status Combined |

---

## Update Jira Test Results

After Playwright tests pass, mark KAN-8 to KAN-12 as Done and add test result comments:

```bash
npm run jira:update
```

---

## MongoDB Verification

```bash
docker exec bug-tracker-mongo mongosh bug-tracker --eval \
  "db.bugs.find({},{title:1,status:1,jiraKey:1,jiraUrl:1,jiraSyncStatus:1}).pretty()"
```

---

## Project Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start frontend + backend (local) |
| `npm run build` | Build React frontend |
| `npm run test:e2e` | Run all Playwright E2E tests |
| `npm run test:report` | Open Playwright HTML report |
| `npm run jira:update` | Mark Jira test cases Done + add comments |

---

## API Reference

| Method | Endpoint | Body / Params |
|--------|----------|---------------|
| GET | `/api/bugs` | `?severity=High&status=Open` |
| POST | `/api/bugs` | `{ title, description, severity }` |
| PATCH | `/api/bugs/:id` | `{ status }` |
| DELETE | `/api/bugs/:id` | — |

---

## Project Structure

```
bug-tracker-lite-sqe/
├── client/                     # React + Vite frontend
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
├── server/                     # Express API + Jira integration
│   ├── models/Bug.js
│   ├── routes/bugs.js
│   ├── services/jira.service.js
│   └── Dockerfile
├── tests/
│   └── bugs.spec.ts            # 10 Playwright test cases
├── docs/
│   ├── project-overview.md
│   └── result-analysis-report.md
├── scripts/
│   ├── seed.js
│   └── update-jira-results.js  # Jira automation script
├── docker-compose.yml
├── playwright.config.ts
├── .env.example
├── .env.jira.example
└── README.md
```

---

## GitHub Security Note

The following files are in `.gitignore` and are **never committed**:

```
.env.jira
server/.env
client/.env
node_modules/
client/node_modules/
server/node_modules/
client/dist/
playwright-report/
test-results/
.claude/
```

Always copy from `.env.jira.example` and fill in your own credentials locally.
