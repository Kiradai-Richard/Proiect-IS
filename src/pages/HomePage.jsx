import React, { useState, useCallback } from 'react';
import './HomePage.css';
import '../index.css';
import ST from '../styles/styles';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/cart';

function HomePage() {
    const navigate = useNavigate();
    const [notification, setNotification] = useState(null);
    const notify = useCallback((msg, type = "success") => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    }, []);
    const { cartCount, addToCart } = useCart(notify, null);

    return (
        <div className='body'>
            <ListaOp cartCount={cartCount} />
            <div className='home-container'>
                <h1 className='home-title'>Pc Garage</h1>
            </div>
        </div>
    );
}

function ListaOp({ cartCount }) {
    const navigate = useNavigate();
    return (
        <div className='lista-container'>
            <button onClick={() => navigate('/login')}>Log in</button>
            <button onClick={() => navigate('/cart')}>
                🛒 Cos {cartCount > 0 && `(${cartCount})`}
            </button>
        </div>
    );
}

export default HomePage;