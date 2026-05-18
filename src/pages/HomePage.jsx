import React, { useState, useCallback, useEffect } from 'react';
import './HomePage.css';
import ST from '../styles/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../components/cart';
import SiteHeader from '../components/layout/SiteHeader';
import {
    mockSystems,
    mockProcessors,
    mockGpus,
    mockMotherboards,
    matchesSearchQuery
} from '../data/catalog';

function HomePage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const pageQuery = searchParams.get('q') || '';
    const [notification, setNotification] = useState(null);
    const [sortType, setSortType] = useState('default');

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('pc-garage-theme');
        if (savedTheme !== null) {
            return savedTheme === 'dark';
        }
        return true;
    });

    const [fontFamily, setFontFamily] = useState(() => {
        return localStorage.getItem('pc-garage-font') || 'Arial, sans-serif';
    });

    useEffect(() => {
        const sectionId = window.location.hash.replace('#', '');
        if (!sectionId) return;
        requestAnimationFrame(() => {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        });
    }, []);

    const notify = useCallback((msg, type = 'success') => {
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

    const handleFontChange = (e) => {
        const newFont = e.target.value;
        setFontFamily(newFont);
        localStorage.setItem('pc-garage-font', newFont);
    };

    const sortProducts = (products, type) => {
        const sortedArray = [...products];
        switch (type) {
            case 'price-asc': return sortedArray.sort((a, b) => a.price - b.price);
            case 'price-desc': return sortedArray.sort((a, b) => b.price - a.price);
            case 'alpha-asc': return sortedArray.sort((a, b) => a.title.localeCompare(b.title));
            default: return sortedArray;
        }
    };

    const filterBySearch = (products) =>
        products.filter((product) => matchesSearchQuery(product, pageQuery));

    const clearPageSearch = () => setSearchParams({});

    const sections = [
        { id: 'section-sisteme', title: 'Rochii', products: mockSystems },
        { id: 'section-procesoare', title: 'Tricouri', products: mockProcessors },
        { id: 'section-placi-video', title: 'Pantaloni & Jeans', products: mockGpus },
        { id: 'section-placi-baza', title: 'Geci', products: mockMotherboards }
    ];

    const visibleSections = sections
        .map((section) => ({
            ...section,
            products: sortProducts(filterBySearch(section.products), sortType)
        }))
        .filter((section) => section.products.length > 0);

    const totalVisible = visibleSections.reduce((sum, s) => sum + s.products.length, 0);

    const renderProduct = (proc) => (
        <div key={proc.id} className="product-card">
            <div
                style={{ cursor: 'pointer', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                onClick={() => navigate(`/product/${proc.id}`, { state: { product: proc } })}
            >
                <div className="image-wrapper">
                    <img
                        src={proc.image}
                        alt={proc.title}
                        className="product-img"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=Fara+Imagine'; }}
                    />
                </div>
                <div className="rating-banner">
                    <span>👍</span> <span>👍</span> <span>👍</span>
                </div>
                <div className="product-title">{proc.title}</div>
                <div className="product-price">
                    {proc.price.toFixed(2).replace('.', ',')} RON
                </div>
                <div className="product-installments">
                    4 rate fara dobanda, doar {proc.installments} RON
                </div>
            </div>
            <button
                className="add-to-cart-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    addToCart(proc);
                }}
            >
                Adauga in cos
            </button>
        </div>
    );

    return (
        <div className={`home-page-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`} style={{ ...ST.app, fontFamily: fontFamily }}>
            <SiteHeader
                isDarkMode={isDarkMode}
                onToggleTheme={toggleTheme}
                fontFamily={fontFamily}
                onFontChange={handleFontChange}
                cartCount={cartCount}
                sortType={sortType}
                setSortType={setSortType}
            />

            <div className="main-content">
                {pageQuery && (
                    <div className="search-filter-banner">
                        <span>
                            Rezultate pentru: <strong>&quot;{pageQuery}&quot;</strong> ({totalVisible} produse)
                        </span>
                        <button type="button" className="clear-search-btn" onClick={clearPageSearch}>
                            Șterge filtrul
                        </button>
                    </div>
                )}

                {pageQuery && totalVisible === 0 ? (
                    <div className="search-no-products">
                        <p>Nu s-au găsit produse pentru &quot;{pageQuery}&quot;.</p>
                        <button type="button" className="clear-search-btn" onClick={clearPageSearch}>
                            Afișează toate produsele
                        </button>
                    </div>
                ) : (
                    visibleSections.map((section) => (
                        <section key={section.id} id={section.id} className="product-section">
                            <h2>{section.title}</h2>
                            <div className="product-grid">
                                {section.products.map(renderProduct)}
                            </div>
                        </section>
                    ))
                )}
            </div>

            {notification && (
                <div className={`notification-toast ${notification.type}`}>
                    {notification.msg}
                </div>
            )}
            <Footer />
        </div>
    );
}

function Footer() {
    return (
        <div style={{
            ...ST.footer,
            padding: '20px 40px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
        }}>
            <div style={{ color: '#888', fontSize: '14px' }}>
                &copy; {new Date().getFullYear()} StyleHub. Toate drepturile rezervate.
            </div>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <a style={{ color: '#e0e0e0', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>
                    ✉️ support@stylehub.ro
                </a>
                <a style={{ color: '#e0e0e0', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>
                    📞 0123 456 789
                </a>
            </div>
        </div>
    );
}

export default HomePage;
