import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecuperareCont.css';

import email_icon from '../Assets/email.png';

function RecuperareCont() {
    const navigate = useNavigate();

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('pc-garage-theme');
        if (savedTheme !== null) {
            return savedTheme === 'dark';
        }
        return true;
    });

    useEffect(() => {
        document.body.classList.add('recover-background');
        document.body.classList.toggle('recover-dark-theme', isDarkMode);
        document.body.classList.toggle('recover-light-theme', !isDarkMode);

        return () => {
            document.body.classList.remove('recover-background');
            document.body.classList.remove('recover-dark-theme');
            document.body.classList.remove('recover-light-theme');
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

            <div className="recover-page container">
                <div className="header">
                    <div className="text">
                        Recuperare Cont
                    </div>
                    <div className="underline"></div>
                </div>

                <div className="recover-description">
                    Introdu email-ul asociat contului tău pentru a reseta parola.
                </div>

                <div className="inputs">
                    <div className="input">
                        <img src={email_icon} alt="email" />
                        <input type="email" placeholder="Email" />
                    </div>
                </div>

                <div className="submit-container">
                    <div className="submit">
                        Reset password
                    </div>
                </div>

                <div className="back-login" onClick={() => navigate('/login')}>
                    Înapoi la Login
                </div>
            </div>
        </>
    );
}

export default RecuperareCont;