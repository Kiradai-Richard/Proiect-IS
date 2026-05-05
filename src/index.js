import React from 'react';
import ReactDom from 'react-dom/client';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import HomePage  from './pages/HomePage';

const root = ReactDom.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />}/>
                <Route path="/home" element ={<HomePage />} /> 
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

/* Basically va adaugati pagina in Routes cu url care il vreti cat timp nu e luat*/
