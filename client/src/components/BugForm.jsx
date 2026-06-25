import React, { useState } from 'react';

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];

export default function BugForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('Low');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    setError('');
    try {
      await onSubmit({ title: title.trim(), description, severity });
      setTitle('');
      setDescription('');
      setSeverity('Low');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="bug-form" onSubmit={handleSubmit} data-testid="bug-form">
      <h2>Report a Bug</h2>

      {error && (
        <p className="error-msg" data-testid="form-error">
          {error}
        </p>
      )}

      <div className="form-row">
        <input
          type="text"
          placeholder="Bug title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          data-testid="input-title"
          aria-label="Bug title"
        />
      </div>

      <div className="form-row">
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          data-testid="input-description"
          aria-label="Bug description"
        />
      </div>

      <div className="form-row">
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          data-testid="select-severity"
          aria-label="Severity"
        >
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button type="submit" className="btn-primary" data-testid="btn-create">
          Create Bug
        </button>
      </div>
    </form>
  );
}
