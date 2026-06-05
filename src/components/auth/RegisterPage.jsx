import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './RegisterPage.css';

import user_icon     from '../Assets/person.png';
import email_icon    from '../Assets/email.png';
import password_icon from '../Assets/password.png';

function RegisterPage() {
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('pc-garage-theme');
    return saved !== null ? saved === 'dark' : true;
  });
  const [name,      setName]      = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    document.body.classList.add('register-background');
    document.body.classList.toggle('register-dark-theme',  isDarkMode);
    document.body.classList.toggle('register-light-theme', !isDarkMode);
    return () => {
      document.body.classList.remove('register-background', 'register-dark-theme', 'register-light-theme');
    };
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('pc-garage-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password.trim()) { setError('Toate campurile sunt obligatorii.'); return; }
    if (password !== confirm) { setError('Parolele nu coincid.'); return; }
    if (password.length < 6)  { setError('Parola trebuie sa aiba minim 6 caractere.'); return; }
    setLoading(true);
    try {
      const { user, token } = await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
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

      <div className="register-page container">
        <div className="header">
          <div className="text">Register</div>
          <div className="underline"></div>
        </div>

        <form onSubmit={handleRegister}>
          <div className="inputs">
            <div className="input">
              <img src={user_icon} alt="user" />
              <input type="text" placeholder="Nume complet" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="input">
              <img src={email_icon} alt="email" />
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="input">
              <img src={password_icon} alt="password" />
              <input type="password" placeholder="Parola" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="input">
              <img src={password_icon} alt="confirm-password" />
              <input type="password" placeholder="Confirma parola" value={confirm} onChange={e => setConfirm(e.target.value)} />
            </div>
          </div>

          {error && (
            <div style={{ color: '#e74c3c', fontSize: 13, textAlign: 'center', margin: '8px 0' }}>
              {error}
            </div>
          )}

          <div className="have-account">
            Ai deja cont? <span onClick={() => navigate('/login')}>Sign in</span>
          </div>

          <div className="submit-container">
            <button
              type="submit"
              className="submit"
              style={{ border: 'none', cursor: 'pointer', width: '100%' }}
              disabled={loading}
            >
              {loading ? '...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default RegisterPage;
