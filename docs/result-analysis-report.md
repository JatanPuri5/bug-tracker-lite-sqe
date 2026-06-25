# Result Analysis Report
## Bug Tracker Lite App — Software Quality Engineering and Testing

---

| Field          | Details                          |
|----------------|----------------------------------|
| **Project**    | Bug Tracker Lite App             |
| **Subject**    | Software Quality Engineering and Testing (SQE) |
| **Platform**   | Jira Cloud + Playwright + Docker |
| **Report Date**| June 2026                        |
| **Status**     | All Test Cases Passed            |

---

## 1. Project Overview

**Bug Tracker Lite App** is a lightweight full-stack web application built as a practical demonstration of software quality engineering principles. The application allows users to create, view, update, filter, and delete bug reports — mimicking the core workflow of professional bug tracking tools.

The project was developed using the **MERN stack** (MongoDB, Express.js, React, Node.js) and containerized using **Docker**. The entire software development lifecycle — from requirement management to automated testing — was managed and tracked using **Jira Cloud**.

### Objectives

- Build a functional bug tracking application aligned with Jira user stories
- Write automated end-to-end tests using Playwright mapped to Jira test cases
- Containerize the full application stack using Docker and Docker Compose
- Automate Jira task status updates using a custom Node.js script with the Jira Cloud REST API v3
- Demonstrate the integration of agile project management with automated software testing

---

## 2. Tools and Technologies

### Application Stack

| Layer       | Technology              | Version  |
|-------------|-------------------------|----------|
| Frontend    | React + Vite            | 18.x / 5.x |
| Backend     | Node.js + Express.js    | 20.x / 4.x |
| Database    | MongoDB + Mongoose      | 7.x / 8.x |
| Styling     | Plain CSS               | —        |

### Testing and QA

| Tool         | Purpose                                      |
|--------------|----------------------------------------------|
| Playwright   | End-to-end browser automation testing        |
| data-testid  | Stable element selectors for test automation |
| HTML Report  | Playwright built-in test report              |

### DevOps and Infrastructure

| Tool              | Purpose                                     |
|-------------------|---------------------------------------------|
| Docker Desktop    | Container runtime environment               |
| Docker Compose    | Multi-container orchestration               |
| Nginx             | Static file serving for the React client    |

### Project Management and Automation

| Tool                  | Purpose                                         |
|-----------------------|-------------------------------------------------|
| Jira Cloud            | Epic, user story, and test case management      |
| Atlassian MCP         | Claude AI integration with Jira                 |
| Jira REST API v3      | Programmatic issue transition and commenting    |
| Node.js Script        | Automated Jira status update after test runs    |
| axios + dotenv        | HTTP client and environment variable management |

---

## 3. Jira MCP Work

The **Atlassian Model Context Protocol (MCP)** was configured and integrated with Claude AI to enable direct interaction with the Jira Cloud project board from within the development environment.

### MCP Integration Steps

1. Configured the Atlassian MCP server in Claude Code settings with the project's Jira Cloud credentials
2. Connected to the Jira project board `KAN` (Bug Tracker Lite)
3. Used MCP to create and manage the project Epic, User Stories, and Test Cases directly through natural language instructions
4. Automated post-test Jira updates using a custom script (`scripts/update-jira-results.js`) leveraging the Jira Cloud REST API v3

### Jira Project Board

- **Site:** `https://jatinpuri108.atlassian.net`
- **Project Key:** `KAN`
- **Board Type:** Scrum

---

## 4. Jira User Stories

An **Epic** was created as the parent container for all user stories and test cases.

### Epic

| Field       | Details                              |
|-------------|--------------------------------------|
| Issue Key   | KAN-2                                |
| Type        | Epic                                 |
| Title       | Bug Tracker Lite App                 |
| Description | Full-stack bug tracking application for SQE subject |

### User Stories (KAN-3 to KAN-7)

| Issue Key | User Story Title              | Acceptance Criteria Summary                                              |
|-----------|-------------------------------|--------------------------------------------------------------------------|
| KAN-3     | Create Bug Report             | User can submit a bug with title, description, and severity. Title is required. |
| KAN-4     | View Bug List                 | All submitted bugs are displayed with title, severity, status, and date. |
| KAN-5     | Update Bug Status             | User can change a bug's status from Open → In Progress → Resolved.       |
| KAN-6     | Filter Bugs by Severity and Status | Dropdown filters narrow the bug list by severity or status. Reset clears filters. |
| KAN-7     | Delete Bug                    | User can permanently delete a bug. The list updates immediately.         |

---

## 5. Jira Test Cases

Five test case tasks were created in Jira under the `KAN` project, each directly mapped to a user story. These test cases defined the scope of Playwright automation.

| Issue Key | Test Case Title                        | Linked User Story | Initial Status |
|-----------|----------------------------------------|-------------------|----------------|
| KAN-8     | TC-01 Create Bug Successfully          | KAN-3             | To Do          |
| KAN-9     | TC-02 Required Title Validation        | KAN-3             | To Do          |
| KAN-10    | TC-03 Update Bug Status                | KAN-5             | To Do          |
| KAN-11    | TC-04 Filter Bugs by Severity and Status | KAN-6           | To Do          |
| KAN-12    | TC-05 Delete Bug Successfully          | KAN-7             | To Do          |

---

## 6. Playwright Automation Execution

### Test File

```
tests/bugs.spec.ts
```

### Configuration

```
playwright.config.ts
- Browser : Chromium (Desktop Chrome)
- Base URL : http://localhost:3000
- Timeout  : 30,000 ms
- Retries  : 1
- Reporter : List + HTML
```

### Test Suite

All tests are grouped under the describe block:
**`Bug Tracker Lite — Jira Test Cases`**

A `beforeEach` hook navigates to the app and clears all existing bugs before every test to ensure a clean and isolated state.

### Test Case Details

---

#### KAN-8 | TC-01 | Create Bug Successfully

**Steps:**
1. Fill in bug title: `Login button not working`
2. Fill in description: `Clicking login does nothing`
3. Select severity: `High`
4. Click **Create Bug**

**Assertions:**
- Bug title appears in the list
- Severity badge shows `High`
- Status badge shows `Open` (default)

**Result:** PASSED

---

#### KAN-9 | TC-02 | Required Title Validation

**Steps:**
1. Leave the title field empty
2. Click **Create Bug**

**Assertions:**
- Validation error message is visible: `Title is required`
- No bug is added to the list

**Result:** PASSED

---

#### KAN-10 | TC-03 | Update Bug Status

**Steps:**
1. Create a bug: `Status update bug`
2. Change status dropdown to `In Progress`
3. Change status dropdown to `Resolved`

**Assertions:**
- Status badge updates to `In Progress` after first change
- Status badge updates to `Resolved` after second change

**Result:** PASSED

---

#### KAN-11 | TC-04 | Filter Bugs by Severity and Status

**Steps:**
1. Create bug: `Critical login crash` with severity `Critical`
2. Create bug: `Low priority typo` with severity `Low`
3. Apply severity filter: `Critical`
4. Reset filters
5. Change first bug's status to `Resolved`
6. Apply status filter: `Resolved`

**Assertions:**
- After severity filter: exactly 1 card shown with `Critical` badge
- After reset: both 2 cards visible
- After status filter: exactly 1 card shown with `Resolved` badge

**Result:** PASSED

---

#### KAN-12 | TC-05 | Delete Bug Successfully

**Steps:**
1. Create a bug: `Bug to be deleted`
2. Click the **Delete** button

**Assertions:**
- Bug title element count becomes 0
- Empty state message is displayed

**Result:** PASSED

---

### Execution Summary

```
Running 5 tests using 1 worker

  ✓  KAN-8  | TC-01 | Create Bug Successfully
  ✓  KAN-9  | TC-02 | Required Title Validation
  ✓  KAN-10 | TC-03 | Update Bug Status
  ✓  KAN-11 | TC-04 | Filter Bugs by Severity and Status
  ✓  KAN-12 | TC-05 | Delete Bug Successfully

  5 passed (duration ~15s)
```

---

## 7. Jira Automation Result

After Playwright tests passed, the automation script `scripts/update-jira-results.js` was executed using:

```bash
npm run jira:update
```

### Script Workflow (per issue)

1. Fetch current issue status via `GET /rest/api/3/issue/{key}?fields=status`
2. If not Done → fetch available transitions via `GET /rest/api/3/issue/{key}/transitions`
3. Find the `Done` transition and apply it via `POST /rest/api/3/issue/{key}/transitions`
4. Post a comment via `POST /rest/api/3/issue/{key}/comment` using Atlassian Document Format (ADF)

### Comment Added to Each Issue

> Automated test executed using Playwright. Result: Passed. Evidence available in Playwright HTML report.

### Result Table

| Issue Key | Test Case                              | Previous Status | New Status | Automation Result |
|-----------|----------------------------------------|-----------------|------------|-------------------|
| KAN-8     | TC-01 Create Bug Successfully          | To Do           | Done       | Passed            |
| KAN-9     | TC-02 Required Title Validation        | To Do           | Done       | Passed            |
| KAN-10    | TC-03 Update Bug Status                | To Do           | Done       | Passed            |
| KAN-11    | TC-04 Filter Bugs by Severity and Status | To Do         | Done       | Passed            |
| KAN-12    | TC-05 Delete Bug Successfully          | To Do           | Done       | Passed            |

**All 5 Jira test case tasks successfully transitioned from To Do → Done.**

---

## 8. Docker Execution

The full application stack was containerized using Docker and orchestrated with Docker Compose.

### Docker Architecture

```
docker-compose.yml
│
├── mongo    (MongoDB 7 — port 27017)
├── server   (Express API — port 5000)
└── client   (React via Nginx — port 3000 → 80)
```

### Container Details

| Container              | Image           | Port Mapping  | Role                        |
|------------------------|-----------------|---------------|-----------------------------|
| bug-tracker-mongo      | mongo:7         | 27017:27017   | Database                    |
| bug-tracker-server     | node:20-alpine  | 5000:5000     | REST API (Express)          |
| bug-tracker-client     | nginx:alpine    | 3000:80       | Frontend (React static files) |

### Client Dockerfile — Multi-Stage Build

```dockerfile
# Stage 1: Build React app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Server Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

### Commands Used

```bash
# Build and start all containers
docker-compose up --build

# Verify running containers
docker ps

# Stop and remove containers
docker-compose down
```

### Nginx Reverse Proxy Config

API requests from the React frontend are proxied to the Express server inside Docker:

```nginx
location /api/ {
    proxy_pass http://server:5000/api/;
}
```

### Docker Execution Result

| Step                        | Status    |
|-----------------------------|-----------|
| MongoDB container started   | Success   |
| Server container started    | Success   |
| Client container built      | Success   |
| Client container started    | Success   |
| App accessible at :3000     | Success   |
| API accessible at :5000     | Success   |

---

## 9. Screenshots / Evidence List

The following evidence was captured during project execution. Screenshots are stored in the `docs/screenshots/` directory.

| # | Evidence Item                                | File Name                              |
|---|----------------------------------------------|----------------------------------------|
| 1 | Jira Board showing Epic KAN-2                | `jira-epic-kan2.png`                   |
| 2 | Jira User Stories KAN-3 to KAN-7             | `jira-user-stories.png`                |
| 3 | Jira Test Cases KAN-8 to KAN-12 (To Do)      | `jira-testcases-todo.png`              |
| 4 | Bug Tracker Lite App running in browser      | `app-dashboard.png`                    |
| 5 | Bug creation form with filled fields         | `app-bug-form.png`                     |
| 6 | Bug list with severity and status badges     | `app-bug-list.png`                     |
| 7 | Severity filter applied (Critical)           | `app-filter-severity.png`              |
| 8 | Status filter applied (Resolved)             | `app-filter-status.png`                |
| 9 | Playwright test run — all 5 passed           | `playwright-all-passed.png`            |
| 10| Playwright HTML Report                       | `playwright-html-report.png`           |
| 11| Jira update script terminal output           | `jira-script-output.png`               |
| 12| Jira Test Cases KAN-8 to KAN-12 (Done)       | `jira-testcases-done.png`              |
| 13| Jira comment on KAN-8 (Playwright result)    | `jira-comment-kan8.png`                |
| 14| Docker Desktop — all containers running      | `docker-containers-running.png`        |
| 15| Docker Compose terminal output               | `docker-compose-output.png`            |

---

## 10. Conclusion

The **Bug Tracker Lite App** project successfully demonstrated a complete software quality engineering workflow from requirements management through to automated testing, CI-style automation, and containerized deployment.

### Key Achievements

| Area                    | Achievement                                                                 |
|-------------------------|-----------------------------------------------------------------------------|
| Requirements Management | 1 Epic (KAN-2) and 5 User Stories (KAN-3 to KAN-7) created and managed in Jira |
| Test Planning           | 5 test cases (KAN-8 to KAN-12) defined and linked to user stories in Jira  |
| Automation              | All 5 Playwright E2E tests executed and passed successfully                 |
| Jira Integration        | All test case tasks automatically transitioned from To Do → Done via REST API |
| Containerization        | Full MERN stack containerized and running with Docker Compose               |
| Code Quality            | Clean, student-friendly code with `data-testid` attributes for test stability |

### Lessons Learned

- **Stable selectors matter:** Using `data-testid` attributes on all interactive elements made Playwright tests resilient to UI styling changes.
- **Test isolation is critical:** Clearing all bugs before each test in `beforeEach` prevented one test's data from polluting another.
- **API v3 requires ADF:** Jira Cloud REST API v3 requires comments to be submitted in Atlassian Document Format (ADF), not plain text strings.
- **Docker networking:** Services in Docker Compose communicate using service names (e.g., `http://server:5000`) rather than `localhost`, which required the Nginx proxy configuration.
- **Environment separation:** Using `.env.jira` separately from `.env` kept Jira credentials isolated and out of version control.

### Final Status

```
User Stories   : 5 / 5   Completed
Test Cases     : 5 / 5   Passed
Jira Updates   : 5 / 5   Done
Docker         : 3 / 3   Containers Running
Overall Result : PASS
```

---

*Report prepared for Software Quality Engineering and Testing (SQE) subject.*
*Project: Bug Tracker Lite App | Jira Project: KAN*
