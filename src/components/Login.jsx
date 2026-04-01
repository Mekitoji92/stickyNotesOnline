import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="login-view">
      <div className="login-card glass-panel">
        <h1>Welcome</h1>
        <p>Please enter your name to continue.</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="input-field"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
          <button type="submit" className="btn btn-primary">
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
