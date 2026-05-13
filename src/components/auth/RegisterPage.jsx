import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

function RegisterPage() {
    const navigate = useNavigate();

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('pc-garage-theme');
        if (savedTheme !== null) {
            return savedTheme === 'dark';
        }
        return true;
    });

    useEffect(() => {
        document.body.classList.add('register-background');
        document.body.classList.toggle('register-dark-theme', isDarkMode);
        document.body.classList.toggle('register-light-theme', !isDarkMode);

        return () => {
            document.body.classList.remove('register-background');
            document.body.classList.remove('register-dark-theme');
            document.body.classList.remove('register-light-theme');
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

            <div className="register-page container">
                <div className="header">
                    <div className="text">
                        Register
                    </div>
                    <div className="underline"></div>
                </div>

                <div className="inputs">
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

                    <div className="input">
                        <img src={password_icon} alt="confirm-password" />
                        <input type="password" placeholder="Confirm Password" />
                    </div>
                </div>

                <div className="have-account">
                    Already have an account? <span onClick={() => navigate('/login')}>Sign in</span>
                </div>

                <div className="submit-container">
                    <div className="submit">Register</div>
                </div>
            </div>
        </>
    );
}

export default RegisterPage;