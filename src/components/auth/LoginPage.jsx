import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

function LoginPage() {
    const navigate = useNavigate();
    const [action, setAction] = useState("Login");

    useEffect(() => {
        document.body.classList.add('login-background');
        return () => {
            document.body.classList.remove('login-background');
        };
    }, []);

    return (
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
                    Lost Password? <span>Click here</span>
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
        </div>
    );
}

export default LoginPage;