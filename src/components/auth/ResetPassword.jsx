import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css';

import password_icon from '../Assets/password.png';

function ResetPassword() {
    const navigate = useNavigate();

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('pc-garage-theme');
        if (savedTheme !== null) {
            return savedTheme === 'dark';
        }
        return true;
    });

    useEffect(() => {
        document.body.classList.add('reset-password-background');
        document.body.classList.toggle('reset-password-dark-theme', isDarkMode);
        document.body.classList.toggle('reset-password-light-theme', !isDarkMode);

        return () => {
            document.body.classList.remove('reset-password-background');
            document.body.classList.remove('reset-password-dark-theme');
            document.body.classList.remove('reset-password-light-theme');
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

            <div className="reset-password-page container">
                <div className="header">
                    <div className="text">
                        Reset Password
                    </div>
                    <div className="underline"></div>
                </div>

                <div className="reset-password-description">
                    Introdu noua parolă pentru contul tău.
                </div>

                <div className="inputs">
                    <div className="input">
                        <img src={password_icon} alt="new-password" />
                        <input type="password" placeholder="Noua parolă" />
                    </div>

                    <div className="input">
                        <img src={password_icon} alt="confirm-new-password" />
                        <input type="password" placeholder="Confirmă noua parolă" />
                    </div>
                </div>

                <div className="submit-container">
                    <div className="submit">
                        Schimba parola
                    </div>
                </div>
            </div>
        </>
    );
}

export default ResetPassword;