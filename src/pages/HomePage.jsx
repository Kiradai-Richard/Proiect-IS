import React, { useState, useCallback } from 'react';
import './HomePage.css';
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
        <div style={{... ST.app}}>
            <div className='header-bar'>
                <h1 className='home-title'> Pc Garage</h1>
                 <ListaOp cartCount={cartCount} />
            </div>
        </div>
    );
}

function ListaOp({ cartCount }) {
    const navigate = useNavigate();
    return (
        <div style={{display: 'flex',gap:20}}>
            <button 
                   style={{ ...ST.btn, padding: "10px 20px", fontSize: 16}}
                   onClick={() => navigate('/login')}>Log in
            </button>
            <button  
                    style={{ ...ST.btn, padding: "10px 20px", fontSize: 14}}
                    onClick={() => navigate('/cart')}>
                    🛒 Cos {cartCount > 0 && `(${cartCount})`}
            </button>

        </div>
    );
}

export default HomePage;