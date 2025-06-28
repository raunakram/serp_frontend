import React, { useState } from 'react';
import axios from 'axios';
import DynamicTable from './DynamicTable';  // Import it

export default function TaskGetForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [taskId, setTaskId] = useState('');
  const [items, setItems] = useState([]);
  const [rawResult, setRawResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setItems([]);
    setRawResult(null);
    setError(null);

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/dataforseo/regular/fetch/`,
        {
          params: {
            username,
            password,
            url: baseUrl,
            task_id: taskId
          }
        }
      );

      const data = response.data;
      setRawResult(data);

      // Try to extract items
      const items = data?.fetched_data?.tasks?.[0]?.result?.[0]?.items || [];
      setItems(items);
    } catch (err) {
      console.error(err);
      setError(err.response?.data || { error: 'Request failed' });
    } finally {
      setLoading(false);
    }
  };


  function downloadCSV(items) {
  if (!items || items.length === 0) {
    alert('No data to download.');
    return;
  }

  // Get all unique keys
  const allKeys = Array.from(
    items.reduce((keys, item) => {
      Object.keys(item).forEach(k => keys.add(k));
      return keys;
    }, new Set())
  );

  // Build CSV header
  const header = allKeys.join(',');

  // Build rows
  const rows = items.map(item =>
    allKeys.map(k => {
      const value = item[k];
      if (typeof value === 'object') {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',')
  );

  // Combine header and rows
  const csvContent = [header, ...rows].join('\n');

  // Trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'dataforseo_results.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


return (
  <>
    <div className="card">
      <h2>Fetch Task Result (Base URL + Task ID)</h2>
      <form onSubmit={handleFetch}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Base DataForSEO URL"
          value={baseUrl}
          required
          onChange={(e) => setBaseUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Task ID"
          value={taskId}
          required
          onChange={(e) => setTaskId(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch Result'}
        </button>
        <button
            type="button"
            onClick={() => downloadCSV(items)}
            >
            Download CSV
        </button>
      </form>
    </div>

    <div className="results-container">
      {error && (
        <pre className="response">{JSON.stringify(error, null, 2)}</pre>
      )}

      {items.length > 0 && (
        <>
          <h3>Parsed Items</h3>
          <DynamicTable items={items} />
        </>
      )}

      {rawResult && (
        <>
          <h3>Raw API Response</h3>
          <pre className="response">
            {JSON.stringify(rawResult, null, 2)}
          </pre>
        </>
      )}
    </div>
  </>
);

}
