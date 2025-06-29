import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import DynamicTable from './DynamicTable';

export default function TaskGetForm() {
  const [baseUrl, setBaseUrl] = useState('');
  const [taskId, setTaskId] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rawResult, setRawResult] = useState(null);

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
            url: baseUrl,
            task_id: taskId
          }
        }
      );
      const data = response.data;
      setRawResult(data);

      const items = data?.tasks?.[0]?.result?.[0]?.items || [];
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

    const allKeys = Array.from(
      items.reduce((keys, item) => {
        Object.keys(item).forEach(k => keys.add(k));
        return keys;
      }, new Set())
    );

    const header = allKeys.join(',');

    const rows = items.map(item =>
      allKeys.map(k => {
        const value = item[k];
        if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',')
    );

    const csvContent = [header, ...rows].join('\n');

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
      </div>
    </>
  );
}
