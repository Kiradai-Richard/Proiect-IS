import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../components/cart';
import ST from '../styles/styles';
import SiteHeader from '../components/layout/SiteHeader';
import './ProductPage.css';

function ProductPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const product = location.state?.product;
    
    // Extragem stările din localStorage
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('pc-garage-theme');
        return savedTheme !== null ? savedTheme === 'dark' : true; 
    });

    const [fontFamily, setFontFamily] = useState(() => {
        return localStorage.getItem('pc-garage-font') || 'Arial, sans-serif';
    });

    const [notification, setNotification] = useState(null);
    const [review, setReview] = useState('');
    const [reviewsList, setReviewsList] = useState([]);

    const notify = useCallback((msg, type = "success") => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    const { cartCount, addToCart } = useCart(notify, null);

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem('pc-garage-theme', newMode ? 'dark' : 'light');
            return newMode;
        });
    };

    // Funcția care schimbă și salvează fontul
    const handleFontChange = (e) => {
        const newFont = e.target.value;
        setFontFamily(newFont);
        localStorage.setItem('pc-garage-font', newFont);
    };

    if (!product) {
        return (
            <div style={{ color: isDarkMode ? 'white' : 'black', padding: '50px', textAlign: 'center' }}>
                Produsul nu a fost găsit. <br/><br/>
                <button onClick={() => navigate('/')} style={{ padding: '10px 20px' }}>Înapoi la Home</button>
            </div>
        );
    }

    const handleAddReview = (e) => {
        e.preventDefault();
        if (review.trim() === '') return;
        setReviewsList([...reviewsList, review]);
        setReview('');
        notify('Recenzie adăugată cu succes!');
    };

    return (
        <div className={`product-page-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`} style={{ ...ST.app, minHeight: '100vh', fontFamily: fontFamily }}>
            
            <SiteHeader
                isDarkMode={isDarkMode}
                onToggleTheme={toggleTheme}
                fontFamily={fontFamily}
                onFontChange={handleFontChange}
                cartCount={cartCount}
                showBackButton
            />

            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.msg}
                </div>
            )}

            <div className="product-details-content">
                <h2 className="product-page-title">{product.title}</h2>
                
                <div className="product-layout">
                    <div className="product-image-section">
                        <div className="main-image-wrapper">
                            <img 
                                src={product.image} 
                                alt={product.title} 
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Fara+Imagine'; }}
                            />
                        </div>
                    </div>

                    <div className="product-action-section">
                        <div className="action-box">
                            <div className="product-page-price">
                                {product.price.toFixed(2).replace('.', ',')} <span>RON</span>
                            </div>
                            
                            <div className="delivery-info">
                                <span className="in-stock">● În stoc</span>
                                <p>Vândut și livrat de: <strong>StyleHub</strong></p>
                                <p className="rate-info-box">
                                    Sau în 4 rate fără dobândă de doar {product.installments} RON
                                </p>
                            </div>
                            
                            <button className="add-to-cart-btn large-btn" onClick={() => addToCart(product)}>
                                Adaugă în Coș
                            </button>
                            
                            <button className="favorite-btn large-btn">
                                ♡ Adaugă la Favorite
                            </button>
                        </div>
                    </div>
                </div>

                <div className="reviews-section">
                    <h3>Recenzii Produs</h3>
                    
                    <form onSubmit={handleAddReview} className="review-form">
                        <textarea 
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Lasă o recenzie pentru acest produs..."
                            rows="4"
                        ></textarea>
                        <button type="submit" className="submit-review-btn">Adaugă Recenzie</button>
                    </form>

                    <div className="reviews-list">
                        {reviewsList.length === 0 ? (
                            <p className="no-reviews">Fii primul care lasă o recenzie!</p>
                        ) : (
                            reviewsList.map((rev, index) => (
                                <div key={index} className="review-item">
                                    <div className="review-user">Utilizator Anonim</div>
                                    <p>{rev}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductPage;