import React from 'react';
import ReactDom from 'react-dom/client';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import HomePage  from './pages/HomePage';
import { CartPage } from './components/cart';

const root = ReactDom.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />}/>
                <Route path="/login" element ={<LoginPage />} />
                <Route path="/cart" element={<CartPage />} />

            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

/* Basically va adaugati pagina in Routes cu url care il vreti cat timp nu e luat*/
