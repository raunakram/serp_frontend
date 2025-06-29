import React, { useState } from 'react';
import axios from '../api/axiosInstance';

export default function TaskPostForm() {
  const [postUrl, setPostUrl] = useState('');

  // Individual fields for payload
  const [languageCode, setLanguageCode] = useState('');
  const [locationCode, setLocationCode] = useState('');
  const [keyword, setKeyword] = useState('');
  const [device, setDevice] = useState('');
  const [tag, setTag] = useState('');
  const [postbackUrl, setPostbackUrl] = useState('');
  const [postbackData, setPostbackData] = useState('');

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setErrorMsg('');

    if (!postUrl || !keyword || !languageCode || !locationCode || !device) {
      setErrorMsg('Please fill all required fields.');
      setLoading(false);
      return;
    }

    try {
      const payload = [{
        language_code: languageCode,
        location_code: Number(locationCode),
        keyword,
        device,
        tag,
        postback_url: postbackUrl,
        postback_data: postbackData
      }];

      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setErrorMsg('You must be logged in.');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/api/dataforseo/regular/task_post/for/post/method/?url=${encodeURIComponent(postUrl)}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`,
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
          placeholder="DataForSEO POST URL"
          value={postUrl}
          required
          onChange={(e) => setPostUrl(e.target.value)}
        />

        <hr />

        <input
          type="text"
          placeholder="Language Code (e.g., en)"
          value={languageCode}
          required
          onChange={(e) => setLanguageCode(e.target.value)}
        />

        <input
          type="number"
          placeholder="Location Code (e.g., 2840)"
          value={locationCode}
          required
          onChange={(e) => setLocationCode(e.target.value)}
        />

        <input
          type="text"
          placeholder="Keyword"
          value={keyword}
          required
          onChange={(e) => setKeyword(e.target.value)}
        />

        <input
          type="text"
          placeholder="Device (e.g., desktop)"
          value={device}
          required
          onChange={(e) => setDevice(e.target.value)}
        />

        <input
          type="text"
          placeholder="Tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />

        <input
          type="url"
          placeholder="Postback URL"
          value={postbackUrl}
          onChange={(e) => setPostbackUrl(e.target.value)}
        />

        <input
          type="text"
          placeholder="Postback Data"
          value={postbackData}
          onChange={(e) => setPostbackData(e.target.value)}
        />

        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

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
