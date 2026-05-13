import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

function LoginPage() {
    const navigate = useNavigate();
    const [action, setAction] = useState("Login");

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('pc-garage-theme');
        if (savedTheme !== null) {
            return savedTheme === 'dark';
        }
        return true;
    });

    useEffect(() => {
        document.body.classList.add('login-background');
        document.body.classList.toggle('login-dark-theme', isDarkMode);
        document.body.classList.toggle('login-light-theme', !isDarkMode);

        return () => {
            document.body.classList.remove('login-background');
            document.body.classList.remove('login-dark-theme');
            document.body.classList.remove('login-light-theme');
        };
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem('pc-garage-theme', newMode ? 'dark' : 'light');
            return newMode;
        });
    };

    return (
        <>
            <button
                className="auth-theme-toggle-btn"
                onClick={toggleTheme}
                title={isDarkMode ? "Comută la modul luminos" : "Comută la modul întunecat"}
            >
                {isDarkMode ? '☀️' : '🌙'}
            </button>

            <div className="login-page container">
                <div className="header">
                    <div className="text">{action}</div>
                    <div className="underline"></div>
                </div>

                <div className="inputs">
                    {/* Dacă ești pe modul Login, poți ascunde opțional câmpul de Username dacă vrei doar Email */}
                    <div className="input">
                        <img src={user_icon} alt="user" />
                        <input type="text" placeholder="Username" />
                    </div>

                    <div className="input">
                        <img src={email_icon} alt="email" />
                        <input type="email" placeholder="Email" />
                    </div>

                    <div className="input">
                        <img src={password_icon} alt="password" />
                        <input type="password" placeholder="Password" />
                    </div>
                </div>
                <div className="recall-container">
                    <div className="remember-me">
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember">Remember me</label>
                    </div>
                    <div className="forgot-password">
                        Lost Password? <span onClick={() => navigate('/recuperare-cont')}>Click here</span>
                    </div>
                </div>
                <div className="submit-container">
                    <div className="submit" onClick={() => navigate('/register')}>
                        Sign up
                    </div>
                    <div className="submit">
                        Login
                    </div>
                </div>
                <div className="back-home" onClick={() => navigate('/')}>
                    Înapoi la pagina principală
                </div>
            </div>
        </>
    );
}

export default LoginPage;