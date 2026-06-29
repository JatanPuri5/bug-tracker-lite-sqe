const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY;

function authHeader() {
  const encoded = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
  return `Basic ${encoded}`;
}

async function jiraRequest(method, path, body) {
  const url = `${JIRA_BASE_URL}/rest/api/3${path}`;
  const opts = {
    method,
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Jira API ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

async function createJiraIssue(bug) {
  const descriptionText = [
    `Title: ${bug.title}`,
    `Description: ${bug.description || 'N/A'}`,
    `Severity: ${bug.severity}`,
    `Status: ${bug.status}`,
    `Source: Bug Tracker Lite App`,
  ].join('\n');

  const data = await jiraRequest('POST', '/issue', {
    fields: {
      project: { key: JIRA_PROJECT_KEY },
      summary: bug.title,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: descriptionText }],
          },
        ],
      },
      issuetype: { name: 'Bug' },
    },
  });

  return {
    key: data.key,
    url: `${JIRA_BASE_URL}/browse/${data.key}`,
  };
}

async function transitionJiraIssue(jiraKey, targetStatus) {
  const { transitions } = await jiraRequest('GET', `/issue/${jiraKey}/transitions`);
  const transition = transitions.find(
    (t) => t.name.toLowerCase() === targetStatus.toLowerCase()
  );
  if (!transition) {
    throw new Error(`Transition "${targetStatus}" not found for ${jiraKey}`);
  }
  await jiraRequest('POST', `/issue/${jiraKey}/transitions`, {
    transition: { id: transition.id },
  });
}

async function addJiraComment(jiraKey, commentText) {
  await jiraRequest('POST', `/issue/${jiraKey}/comment`, {
    body: {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: commentText }],
        },
      ],
    },
  });
}

module.exports = { createJiraIssue, transitionJiraIssue, addJiraComment };
