import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

function RegisterPage() {
    const navigate = useNavigate();
    useEffect(() => {
        document.body.classList.add('register-background');
        return () => {
            document.body.classList.remove('register-background');
        };
    }, []);

    return (
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
    );
}

export default RegisterPage;