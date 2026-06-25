import React from 'react';

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['Open', 'In Progress', 'Resolved'];

export default function BugFilters({
  severityFilter,
  statusFilter,
  onSeverityChange,
  onStatusChange,
  onReset,
}) {
  return (
    <div className="filters" data-testid="bug-filters">
      <label htmlFor="filter-severity">Severity:</label>
      <select
        id="filter-severity"
        value={severityFilter}
        onChange={(e) => onSeverityChange(e.target.value)}
        data-testid="filter-severity"
        aria-label="Filter by severity"
      >
        <option value="">All</option>
        {SEVERITIES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <label htmlFor="filter-status">Status:</label>
      <select
        id="filter-status"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        data-testid="filter-status"
        aria-label="Filter by status"
      >
        <option value="">All</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <button className="btn-reset" onClick={onReset} data-testid="btn-reset-filters">
        Reset
      </button>
    </div>
  );
}
