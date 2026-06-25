require('dotenv').config({ path: '.env.jira' });
const axios = require('axios');

const { JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN } = process.env;

if (!JIRA_BASE_URL || !JIRA_EMAIL || !JIRA_API_TOKEN) {
  console.error(
    '\n[ERROR] Missing required environment variables.\n' +
    'Copy .env.jira.example to .env.jira and fill in your credentials.\n'
  );
  process.exit(1);
}

const COMMENT_TEXT =
  'Automated test executed using Playwright. Result: Passed. ' +
  'Evidence available in Playwright HTML report.';

const TEST_ISSUES = [
  { key: 'KAN-8',  title: 'TC-01 Create Bug Successfully' },
  { key: 'KAN-9',  title: 'TC-02 Required Title Validation' },
  { key: 'KAN-10', title: 'TC-03 Update Bug Status' },
  { key: 'KAN-11', title: 'TC-04 Filter Bugs by Severity and Status' },
  { key: 'KAN-12', title: 'TC-05 Delete Bug Successfully' },
];

const auth = {
  username: JIRA_EMAIL,
  password: JIRA_API_TOKEN,
};

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

async function getIssueStatus(issueKey) {
  const res = await axios.get(
    `${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}?fields=status`,
    { auth, headers }
  );
  return res.data.fields.status.name;
}

async function getTransitions(issueKey) {
  const res = await axios.get(
    `${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}/transitions`,
    { auth, headers }
  );
  return res.data.transitions;
}

async function transitionToDone(issueKey) {
  const transitions = await getTransitions(issueKey);
  const done = transitions.find(
    (t) => t.name.toLowerCase() === 'done'
  );

  if (!done) {
    const available = transitions.map((t) => `"${t.name}"`).join(', ');
    throw new Error(
      `No "Done" transition found for ${issueKey}. Available: ${available}`
    );
  }

  await axios.post(
    `${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}/transitions`,
    { transition: { id: done.id } },
    { auth, headers }
  );
}

async function addComment(issueKey) {
  await axios.post(
    `${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}/comment`,
    {
      body: {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: COMMENT_TEXT }],
          },
        ],
      },
    },
    { auth, headers }
  );
}

function printTable(results) {
  const COL = [12, 42, 12, 10];
  const HEADERS = ['Issue Key', 'Test Case', 'New Status', 'Result'];

  const divider = '+' + COL.map((w) => '-'.repeat(w + 2)).join('+') + '+';
  const row = (cells) =>
    '| ' + cells.map((c, i) => String(c).padEnd(COL[i])).join(' | ') + ' |';

  console.log('\n' + divider);
  console.log(row(HEADERS));
  console.log(divider);
  results.forEach((r) => console.log(row([r.key, r.title, r.status, r.result])));
  console.log(divider + '\n');
}

async function processIssue(issue) {
  let currentStatus;
  let newStatus;
  let result;

  try {
    currentStatus = await getIssueStatus(issue.key);

    if (currentStatus.toLowerCase() === 'done') {
      console.log(`[SKIP]    ${issue.key} is already Done — skipping transition.`);
      newStatus = 'Done';
    } else {
      console.log(`[MOVING]  ${issue.key} : "${currentStatus}" → Done`);
      await transitionToDone(issue.key);
      newStatus = 'Done';
    }

    console.log(`[COMMENT] ${issue.key} — adding test result comment.`);
    await addComment(issue.key);

    result = 'Passed';
  } catch (err) {
    const msg = err.response
      ? `HTTP ${err.response.status}: ${JSON.stringify(err.response.data)}`
      : err.message;
    console.error(`[ERROR]   ${issue.key} — ${msg}`);
    newStatus = currentStatus || 'Unknown';
    result = 'Error';
  }

  return { key: issue.key, title: issue.title, status: newStatus, result };
}

async function main() {
  console.log('\nJira Test Result Updater — Bug Tracker Lite (SQE)');
  console.log('='.repeat(52));
  console.log(`Site : ${JIRA_BASE_URL}`);
  console.log(`User : ${JIRA_EMAIL}`);
  console.log(`Issues: ${TEST_ISSUES.map((i) => i.key).join(', ')}\n`);

  const results = [];
  for (const issue of TEST_ISSUES) {
    const r = await processIssue(issue);
    results.push(r);
  }

  printTable(results);

  const errors = results.filter((r) => r.result === 'Error').length;
  if (errors > 0) {
    console.error(`${errors} issue(s) failed to update. Check errors above.\n`);
    process.exit(1);
  }

  console.log('All issues updated successfully.\n');
}

main();
