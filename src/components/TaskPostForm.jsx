import React, { useState } from 'react';
import axios from 'axios';

export default function TaskPostForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [payload, setPayload] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const parsedPayload = JSON.parse(payload);

      const response = await axios.post(
        `http://127.0.0.1:8000/api/dataforseo/regular/task_post/for/post/method/?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&url=${encodeURIComponent(postUrl)}`,
        parsedPayload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setResult(response.data);
    } catch (err) {
      console.error(err);
      setResult(err.response?.data || { error: 'Request failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>POST - Create Task</h2>
      <form onSubmit={handleSubmit}>
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
          placeholder="DataForSEO POST URL"
          value={postUrl}
          required
          onChange={(e) => setPostUrl(e.target.value)}
        />
        <br />
        <textarea
          rows="8"
          cols="60"
          placeholder='Enter JSON array payload, e.g. [{"keyword": "albert einstein", ...}]'
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          required
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Task'}
        </button>
      </form>
      {result && (
        <pre className="response">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
