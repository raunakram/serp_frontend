import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TaskPostForm from './components/TaskPostForm';
import TaskGetForm from './components/TaskGetForm';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <header>
          <h1>DataForSEO Client</h1>
          <nav>
            <Link to="/">Home</Link> | <Link to="/post">POST Task</Link> | <Link to="/get">GET Task</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post" element={<TaskPostForm />} />
          <Route path="/get" element={<TaskGetForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
