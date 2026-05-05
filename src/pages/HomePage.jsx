import React from 'react';
import './HomePage.css';
import '../index.css';
import { useNavigate } from 'react-router-dom';



function HomePage() {
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
        </div>
    );
}

export default HomePage;