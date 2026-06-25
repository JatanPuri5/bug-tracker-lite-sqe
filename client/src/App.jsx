import React, { useState, useEffect, useCallback } from 'react';
import BugForm from './components/BugForm';
import BugFilters from './components/BugFilters';
import BugList from './components/BugList';

const API = '/api/bugs';

export default function App() {
  const [bugs, setBugs] = useState([]);
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchBugs = useCallback(async () => {
    const params = new URLSearchParams();
    if (severityFilter) params.set('severity', severityFilter);
    if (statusFilter) params.set('status', statusFilter);
    const res = await fetch(`${API}?${params}`);
    const data = await res.json();
    setBugs(data);
  }, [severityFilter, statusFilter]);

  useEffect(() => {
    fetchBugs();
  }, [fetchBugs]);

  const handleCreate = async (bugData) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bugData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create bug');
    }
    fetchBugs();
  };

  const handleStatusChange = async (id, status) => {
    await fetch(`${API}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchBugs();
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    fetchBugs();
  };

  return (
    <div className="app">
      <header>
        <h1 data-testid="app-title">Bug Tracker Lite</h1>
      </header>

      <BugForm onSubmit={handleCreate} />

      <BugFilters
        severityFilter={severityFilter}
        statusFilter={statusFilter}
        onSeverityChange={setSeverityFilter}
        onStatusChange={setStatusFilter}
        onReset={() => { setSeverityFilter(''); setStatusFilter(''); }}
      />

      <BugList
        bugs={bugs}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </div>
  );
}
