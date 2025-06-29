import React, { useState } from 'react';
import axios from '../api/axiosInstance';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [seoApiToken, setSeoApiToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    // Validate all fields are filled
    if (!username || !email || !password || !password2 || !seoApiToken) {
      setError({ error: "All fields are mandatory. Please fill them all." });
      setLoading(false);
      return;
    }

    if (password !== password2) {
      setError({ error: "Passwords do not match." });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/user/register/',
        {
          username,
          email,
          password,
          password2,
          seo_api_token: seoApiToken
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data || { error: 'Request failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Register New User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Data for SEO (SERP Register Email)"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={password2}
          required
          onChange={(e) => setPassword2(e.target.value)}
        />
        <input
          type="text"
          placeholder="SEO API Token"
          value={seoApiToken}
          required
          onChange={(e) => setSeoApiToken(e.target.value)}
        />

        {error && (
          <p style={{ color: 'red' }}>
            {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      {result && (
        <pre className="response">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
