import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import TaskPostForm from './components/TaskPostForm';
import TaskGetForm from './components/TaskGetForm';
import Home from './pages/Home';
import './App.css';
import Login from './pages/Login';
import Register from './components/Register';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));

  // Watch localStorage changes in other tabs
  useEffect(() => {
    const handler = () => {
      setIsLoggedIn(!!localStorage.getItem('authToken'));
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  return (
    <BrowserRouter>
      <div className="container">
        <header>
          <h1>DataForSEO Client</h1>
          <nav>
            <Link to="/">Home</Link> |

            {isLoggedIn ? (
              <>
                <Link to="/post">POST Task</Link> |
                <Link to="/get">GET Task</Link> |
                <button className="logout-button" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link> |
                <Link to="/register">Register</Link>
              </>
            )}
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post" element={<TaskPostForm />} />
          <Route path="/get" element={<TaskGetForm />} />
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
