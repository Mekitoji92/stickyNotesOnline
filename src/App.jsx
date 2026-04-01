import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('sno_user');
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleLogin = (name) => {
    localStorage.setItem('sno_user', name);
    setUser(name);
  };

  const handleLogout = () => {
    localStorage.removeItem('sno_user');
    setUser(null);
  };

  return (
    <>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
