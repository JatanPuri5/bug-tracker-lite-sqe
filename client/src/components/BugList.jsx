import React from 'react';

const STATUSES = ['Open', 'In Progress', 'Resolved'];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function BugCard({ bug, onStatusChange, onDelete }) {
  const statusClass = bug.status.replace(' ', '-');

  return (
    <div className="bug-card" data-testid="bug-card" data-id={bug._id}>
      <div className="bug-info">
        <p className="bug-title" data-testid="bug-title">
          {bug.title}
        </p>
        {bug.description && (
          <p className="bug-description" data-testid="bug-description">
            {bug.description}
          </p>
        )}
        <div className="bug-meta">
          <span className={`badge badge-${bug.severity}`} data-testid="bug-severity">
            {bug.severity}
          </span>
          <span className={`badge badge-${statusClass}`} data-testid="bug-status-badge">
            {bug.status}
          </span>
          <span className="bug-date">{formatDate(bug.createdAt)}</span>
        </div>
      </div>

      <div className="bug-actions">
        <select
          value={bug.status}
          onChange={(e) => onStatusChange(bug._id, e.target.value)}
          data-testid="select-status"
          aria-label={`Change status of ${bug.title}`}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          className="btn-delete"
          onClick={() => onDelete(bug._id)}
          data-testid="btn-delete"
          aria-label={`Delete ${bug.title}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function BugList({ bugs, onStatusChange, onDelete }) {
  return (
    <div>
      <p className="bug-count" data-testid="bug-count">
        {bugs.length} bug{bugs.length !== 1 ? 's' : ''} found
      </p>

      {bugs.length === 0 ? (
        <div className="empty-state" data-testid="empty-state">
          No bugs found. Report one above!
        </div>
      ) : (
        <div className="bug-list" data-testid="bug-list">
          {bugs.map((bug) => (
            <BugCard
              key={bug._id}
              bug={bug}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
