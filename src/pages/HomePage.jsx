import React from 'react';
import './HomePage.css';
import '../index.css';
import ST from '../styles/styles';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/cart';
import React, { useState, useCallback } from 'react';



function HomePage() {
    const navigate = useNavigate();
    const [notification,setNotification] = useState(null);
    const notify = useCallback((msg,type = "success") => {
        setNotification({msg,type});
        setTimeout(() => setNotification(null), 3000);
    }, [])
    const {cartCount, addToCart} = useCart(notify,null);
    return (
        <>
            <div className= 'body'>
         <ListaOp />
            <div className='home-container'>
                <h1 className='home-title'>Pc Garage</h1>
            </div>
            </div>
        </>
    );
}
function ListaOp()
{
    const navigate = useNavigate();
    const handleLoginButton = () =>
    {
       navigate('/login');
    };
    return (
        <div className='lista-container'>
            <button onClick={handleLoginButton}>
                Log in
            </button>
            <button onClick={() => navigate('/cart')}>
                🛒 Cos {cartCount > 0 && `(${cartCount})`}
            </button>
        </div>
    );
}




export default HomePage;