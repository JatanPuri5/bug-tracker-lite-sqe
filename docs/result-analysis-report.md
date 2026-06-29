# Result Analysis Report
## Bug Tracker Lite App — Software Quality Engineering and Testing (SQE)

**Date:** 2026-06-29  
**Student:** Jatan Puri  
**Jira Site:** https://jatinpuri108.atlassian.net  
**Project Key:** KAN  
**GitHub:** https://github.com/JatanPuri5/bug-tracker-lite-sqe.git

---

## 1. Project Overview

Bug Tracker Lite is a lightweight MERN-stack web application developed as a practical demonstration of software quality engineering principles. Users can report, view, update, filter, and delete bugs. Every bug created in the app automatically creates a linked Jira issue. When a bug is marked **Resolved**, the linked Jira issue is automatically transitioned to **Done**.

The project demonstrates a complete SQE lifecycle:

- Requirements captured as Jira Epic and User Stories
- MERN application built to satisfy those stories
- Docker Compose used for containerized deployment
- Playwright used for end-to-end automated testing (10 test cases)
- Jira test case statuses updated automatically via REST API
- Project version-controlled on GitHub with secrets excluded

---

## 2. Tools Used

| Category | Tool | Purpose |
|----------|------|---------|
| Frontend | React 18 + Vite | User interface |
| Backend | Node.js + Express | REST API |
| Database | MongoDB 7 + Mongoose | Data persistence |
| Containerization | Docker + Docker Compose | Multi-service deployment |
| Static serving | Nginx (alpine) | Serves React build inside Docker |
| E2E Testing | Playwright | Browser automation |
| Issue Tracking | Atlassian Jira REST API v3 | Issue creation and transitions |
| MCP (Claude Code) | Atlassian MCP + Playwright MCP | AI-integrated Jira and browser control |
| Automation | Node.js script (update-jira-results.js) | Post-test Jira updates |
| Version Control | GitHub | Source delivery |

---

## 3. Jira Epic, Stories, and Test Cases

### Epic

| Key | Title | Status |
|-----|-------|--------|
| KAN-2 | Bug Tracker Lite App | To Do |

### User Stories

| Key | Title | Acceptance Criteria |
|-----|-------|---------------------|
| KAN-3 | Create Bug Report | User submits bug with title, description, severity. Title required. |
| KAN-4 | View Bug List | Bugs displayed with title, severity, status, date. |
| KAN-5 | Update Bug Status | Status cycles: Open → In Progress → Resolved. |
| KAN-6 | Filter Bugs | Dropdowns filter by severity and status. Reset clears filters. |
| KAN-7 | Delete Bug | Bug permanently removed; list updates immediately. |

### Test Case Tasks — Final Status

| Key | Title | Linked Story | Status |
|-----|-------|--------------|--------|
| KAN-8 | TC-01 Create Bug Successfully | KAN-3 | **Done** |
| KAN-9 | TC-02 Required Title Validation | KAN-3 | **Done** |
| KAN-10 | TC-03 Update Bug Status | KAN-5 | **Done** |
| KAN-11 | TC-04 Filter Bugs by Severity and Status | KAN-6 | **Done** |
| KAN-12 | TC-05 Delete Bug Successfully | KAN-7 | **Done** |

---

## 4. Docker Execution

**Commands:**
```bash
docker compose down
docker compose up --build -d
docker compose ps
```

**Container Status (verified 2026-06-29):**

| Container | Image | Port | Status |
|-----------|-------|------|--------|
| bug-tracker-mongo | mongo:7 | 27017 | Running |
| bug-tracker-server | bug-tracker-lite-sqe-server (node:20-alpine) | 5000 | Running |
| bug-tracker-client | bug-tracker-lite-sqe-client (nginx:alpine) | 3000 | Running |

All three containers started successfully. The deprecated `version` attribute was removed from `docker-compose.yml`.

---

## 5. Playwright Automation Execution

**Command:**
```bash
npm run test:e2e
```

**Configuration:**
- Browser: Chromium (headless Desktop Chrome)
- Base URL: `http://localhost:3000`
- Timeout: 30,000 ms per test
- Retries: 1
- Reporter: List + HTML

**Test Results (10/10 Passed):**

| # | Jira Key | Test Case | Result | Duration |
|---|----------|-----------|--------|----------|
| 1 | KAN-8 | TC-01 Create Bug Successfully | PASS | 3.9s |
| 2 | KAN-9 | TC-02 Required Title Validation | PASS | 0.9s |
| 3 | KAN-10 | TC-03 Update Bug Status | PASS | 4.3s |
| 4 | KAN-11 | TC-04 Filter Bugs by Severity and Status | PASS | 7.4s |
| 5 | KAN-12 | TC-05 Delete Bug Successfully | PASS | 2.8s |
| 6 | KAN-13 | TC-06 Page Loads with Title and Empty State | PASS | 0.5s |
| 7 | KAN-14 | TC-07 Bug Count Updates as Bugs Are Added | PASS | 4.0s |
| 8 | KAN-15 | TC-08 Form Resets After Successful Submission | PASS | 2.7s |
| 9 | KAN-16 | TC-09 Bug Description Is Displayed on Card | PASS | 2.4s |
| 10 | KAN-17 | TC-10 Filter by Severity and Status Combined | PASS | 6.9s |

**Summary:** 10/10 tests passed in 36.7 seconds.

KAN-8 to KAN-12 are the five Jira-mapped test cases. KAN-13 to KAN-17 are additional coverage tests for page load, bug count, form reset, description display, and combined filtering.

---

## 6. Jira Automation Result

**Command:**
```bash
npm run jira:update
```

The script loaded credentials from `.env.jira` (never printed), queried each issue's current status, transitioned any non-Done issues to Done, and posted a Playwright result comment.

**Comment added to each issue:**
> "Automated test executed using Playwright. Result: Passed. Evidence available in Playwright HTML report."

**Result:**

| Issue Key | Test Case | New Status | Result |
|-----------|-----------|------------|--------|
| KAN-8 | TC-01 Create Bug Successfully | Done | Passed |
| KAN-9 | TC-02 Required Title Validation | Done | Passed |
| KAN-10 | TC-03 Update Bug Status | Done | Passed |
| KAN-11 | TC-04 Filter Bugs by Severity and Status | Done | Passed |
| KAN-12 | TC-05 Delete Bug Successfully | Done | Passed |

---

## 7. Jira App Integration Result

| Behaviour | Verified |
|-----------|----------|
| `POST /api/bugs` creates a Jira Bug issue in KAN | Yes |
| `jiraKey` and `jiraUrl` stored in MongoDB on SYNCED | Yes |
| `jiraSyncStatus: 'SYNCED'` set on successful sync | Yes |
| `jiraSyncStatus: 'FAILED'` set on Jira API error | Yes |
| `PATCH /api/bugs/:id` with `status: Resolved` transitions Jira issue to Done | Yes |
| Jira comment added automatically on Resolved | Yes |
| Jira key displayed as clickable link on bug card | Yes |
| "Jira Sync: Failed" shown on card if sync fails | Yes |
| Credentials read from env vars only — never hardcoded | Yes |

---

## 8. MongoDB Verification

**Command:**
```bash
docker exec bug-tracker-mongo mongosh bug-tracker --eval \
  "db.bugs.find({},{title:1,status:1,jiraKey:1,jiraUrl:1,jiraSyncStatus:1}).pretty()"
```

**Sample Output (verified 2026-06-29):**
```json
[
  {
    "title": "High Open bug",
    "status": "Resolved",
    "jiraKey": "KAN-34",
    "jiraUrl": "https://jatinpuri108.atlassian.net/browse/KAN-34",
    "jiraSyncStatus": "SYNCED"
  },
  {
    "title": "High Resolved bug",
    "status": "Open",
    "jiraKey": "KAN-35",
    "jiraUrl": "https://jatinpuri108.atlassian.net/browse/KAN-35",
    "jiraSyncStatus": "SYNCED"
  }
]
```

Bugs are persisted with Jira keys and `jiraSyncStatus: SYNCED`, confirming full end-to-end integration.

---

## 9. Evidence Checklist

| Item | Status |
|------|--------|
| Atlassian MCP connected | Done |
| Playwright MCP connected | Done |
| Jira project KAN accessible via REST API | Done |
| Epic KAN-2 confirmed | Done |
| User Stories KAN-3 to KAN-7 confirmed | Done |
| Test Cases KAN-8 to KAN-12 confirmed | Done |
| Docker: all 3 containers running | Done |
| MERN app accessible at localhost:3000 | Done |
| POST /api/bugs creates Jira issue | Done |
| PATCH /api/bugs/:id transitions Jira to Done | Done |
| MongoDB stores jiraKey and jiraSyncStatus | Done |
| 10/10 Playwright tests passed | Done |
| KAN-8 to KAN-12 transitioned to Done in Jira | Done |
| Playwright comments added to Jira issues | Done |
| README updated (professional, complete) | Done |
| .env.jira excluded from git (.gitignore) | Done |
| GitHub push completed with no secrets committed | Done |

---

## 10. Conclusion

The Bug Tracker Lite App project successfully demonstrated all required SQE competencies:

| Area | Achievement |
|------|-------------|
| Requirements Management | Jira Epic + 5 User Stories defined and tracked in project KAN |
| Test Planning | 5 test cases (KAN-8 to KAN-12) linked to stories and automated |
| Application Development | MERN stack implements all user stories with Jira integration |
| Containerization | Docker Compose orchestrates mongo, server, and client cleanly |
| Test Automation | 10/10 Playwright E2E tests passed across all core flows |
| Jira Automation | Test results pushed to Jira automatically via REST API script |
| Security | Credentials in `.env.jira` (gitignored), never in code or commits |
| Version Control | GitHub push with all sensitive files excluded |

```
User Stories  : 5 / 5   Defined
Test Cases    : 10 / 10  Passed  (5 Jira-mapped + 5 additional coverage)
Jira Updates  : 5 / 5   Done
Docker        : 3 / 3   Containers Running
Overall       : PASS — Project is presentation-ready
```

---

*Report prepared for Software Quality Engineering and Testing (SQE)*  
*Project: Bug Tracker Lite App | Jira Key: KAN | Date: 2026-06-29*
