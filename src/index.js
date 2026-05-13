import React from 'react';
import ReactDom from 'react-dom/client';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import HomePage  from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import { CartPage } from './components/cart';
import RegisterPage from "./components/auth/RegisterPage";
import RecuperareCont from "./components/auth/RecuperareCont";
import ResetPassword from "./components/auth/ResetPassword";
import ServicePage from './components/service/ServicePage';
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
                <Route path="/recuperare-cont" element={<RecuperareCont />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/service" element={<ServicePage />} />
                <Route path='adminpanel' element={<AdminPanel />}/>

            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

/* Basically va adaugati pagina in Routes cu url care il vreti cat timp nu e luat*/
