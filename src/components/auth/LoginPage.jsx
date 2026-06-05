import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './LoginPage.css';

import user_icon     from '../Assets/person.png';
import email_icon    from '../Assets/email.png';
import password_icon from '../Assets/password.png';

function LoginPage() {
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('pc-garage-theme');
    return saved !== null ? saved === 'dark' : true;
  });
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    document.body.classList.add('login-background');
    document.body.classList.toggle('login-dark-theme',  isDarkMode);
    document.body.classList.toggle('login-light-theme', !isDarkMode);
    return () => {
      document.body.classList.remove('login-background', 'login-dark-theme', 'login-light-theme');
    };
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('pc-garage-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) { setError('Completeaza email si parola.'); return; }
    setLoading(true);
    try {
      const { user, token } = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('pcg_token', token);
      localStorage.setItem('pcg_user', JSON.stringify(user));
      navigate('/');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="auth-theme-toggle-btn"
        onClick={toggleTheme}
        title={isDarkMode ? 'Comută la modul luminos' : 'Comută la modul întunecat'}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      <div className="login-page container">
        <div className="header">
          <div className="text">Login</div>
          <div className="underline"></div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="inputs">
            <div className="input">
              <img src={user_icon} alt="user" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="input">
              <img src={password_icon} alt="password" />
              <input
                type="password"
                placeholder="Parola"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <div style={{ color: '#e74c3c', fontSize: 13, textAlign: 'center', margin: '8px 0' }}>
              {error}
            </div>
          )}

          <div className="recall-container">
            <div className="remember-me">
              <input type="checkbox" id="remember" checked={remember} onChange={e => setRemember(e.target.checked)} />
              <label htmlFor="remember">Tine-ma minte</label>
            </div>
            <div className="forgot-password">
              Ai uitat parola? <span onClick={() => navigate('/recuperare-cont')}>Click here</span>
            </div>
          </div>

          <div className="submit-container">
            <div className="submit" onClick={() => navigate('/register')}>Sign up</div>
            <button
              type="submit"
              className="submit"
              style={{ border: 'none', cursor: 'pointer' }}
              disabled={loading}
            >
              {loading ? '...' : 'Login'}
            </button>
          </div>
        </form>

        <div className="back-home" onClick={() => navigate('/')}>
          Înapoi la pagina principală
        </div>
      </div>
    </>
  );
}

export default LoginPage;
