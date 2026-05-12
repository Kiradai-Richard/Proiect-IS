import React from 'react';
import ReactDom from 'react-dom/client';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import HomePage  from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import { CartPage } from './components/cart';
import RegisterPage from "./components/auth/RegisterPage";
import AdminPanel from "./components/admin/AdminPage";

const root = ReactDom.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />}/>
                <Route path="/login" element ={<LoginPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path='register' element={<RegisterPage />}/>
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path='adminpanel' element={<AdminPanel />}/>

            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

/* Basically va adaugati pagina in Routes cu url care il vreti cat timp nu e luat*/
