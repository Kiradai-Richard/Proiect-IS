import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import ST from '../../styles/styles';
import { categoryShortcuts, matchesSearchQuery } from '../../data/catalog';
import { getUser, logout } from '../../services/api';
import './SiteHeader.css';

function HeaderMenu({ cartCount, isDarkMode, products }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = getUser();

  const handleNavigation = (path, state = {}) => {
    navigate(path, state);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <div className="header-menu" style={{ position: 'relative', display: 'inline-block' }}>
      <button
        style={{ ...ST.btn, padding: '10px 15px', fontSize: 16, minWidth: '150px' }}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ☰ Meniu
      </button>
      {isMenuOpen && (
        <div
          style={{
            position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
            marginTop: 10, display: 'flex',
            backgroundColor: isDarkMode ? 'rgba(0,0,0,0.85)' : 'rgba(255,252,252,0.95)',
            flexDirection: 'column', gap: 10, padding: 15,
            borderRadius: 8, boxShadow: '0px 8px 16px rgba(0,0,0,0.5)',
            zIndex: 1000, minWidth: 180,
          }}
        >
          {user ? (
            <>
              <div style={{ fontSize: 12, color: '#888', padding: '4px 0', borderBottom: '1px solid #2a2a4a', marginBottom: 4 }}>
                {user.name} · <span style={{ color: '#FF6B35' }}>{user.role === 'manager' ? 'Manager' : user.role === 'employee' ? `${user.level}` : 'Client'}</span>
              </div>
              {(user.role === 'manager' || user.role === 'employee') && (
                <button style={{ ...ST.btn, padding: '10px 15px', fontSize: 14 }} onClick={() => handleNavigation('/adminpanel')}>
                  ⚙️ Admin Panel
                </button>
              )}
              <button style={{ ...ST.btn, padding: '10px 15px', fontSize: 14 }} onClick={() => handleNavigation('/cart')}>
                🛒 Cos {cartCount > 0 && `(${cartCount})`}
              </button>
              <button style={{ ...ST.btn, padding: '10px 15px', fontSize: 14 }} onClick={() => handleNavigation('/service', { state: { isDarkMode } })}>
                🔧 Service
              </button>
              <button style={{ ...ST.btnSec, padding: '10px 15px', fontSize: 14 }} onClick={handleLogout}>
                Deconectare
              </button>
            </>
          ) : (
            <>
              <button style={{ ...ST.btn, padding: '10px 15px', fontSize: 14 }} onClick={() => handleNavigation('/login')}>
                Log in
              </button>
              <button style={{ ...ST.btn, padding: '10px 15px', fontSize: 14 }} onClick={() => handleNavigation('/register')}>
                Register
              </button>
              <button style={{ ...ST.btn, padding: '10px 15px', fontSize: 14 }} onClick={() => handleNavigation('/cart')}>
                🛒 Cos {cartCount > 0 && `(${cartCount})`}
              </button>
              <button style={{ ...ST.btn, padding: '10px 15px', fontSize: 14 }} onClick={() => handleNavigation('/service', { state: { isDarkMode } })}>
                🔧 Service
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function StoreNavBar({ sortType, setSortType, showSort, products }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm,  setSearchTerm]  = useState(() => searchParams.get('q') || '');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => { setSearchTerm(searchParams.get('q') || ''); }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = (products || []).filter(p => matchesSearchQuery(p, searchTerm));

  const applyPageSearch = () => {
    const query = searchTerm.trim();
    setShowResults(false);
    if (location.pathname === '/') {
      query ? setSearchParams({ q: query }) : setSearchParams({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (query) {
      navigate(`/?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/');
    }
  };

  const handleSearchKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); applyPageSearch(); } };

  const handleSearchProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
    setSearchTerm('');
    setShowResults(false);
  };

  const goToCategory = (sectionId) => {
    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', `#${sectionId}`);
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <nav className="shortcuts-bar" aria-label="Navigare magazin">
      <div className="shortcut-links">
        {categoryShortcuts.map(shortcut => (
          <button key={shortcut.id} type="button" className="shortcut-link" onClick={() => goToCategory(shortcut.id)}>
            {shortcut.name}
          </button>
        ))}
      </div>

      <div className="search-container" ref={searchRef}>
        <input
          type="text"
          className="product-search-input"
          placeholder="Caută produse..."
          value={searchTerm}
          onChange={e => { setSearchTerm(e.target.value); setShowResults(true); }}
          onKeyDown={handleSearchKeyDown}
        />
        {searchTerm && showResults && (
          <div className="search-results">
            {filteredProducts.length > 0 ? (
              filteredProducts.slice(0, 8).map(product => (
                <div key={product.id} className="search-result-item" onClick={() => handleSearchProductClick(product)}>
                  <img src={product.image} alt={product.name} className="search-result-img"
                    onError={e => { e.target.src = 'https://via.placeholder.com/50?text=Img'; }} />
                  <div>
                    <div className="search-result-title">{product.name}</div>
                    <div className="search-result-price">{Number(product.price).toFixed(2).replace('.', ',')} RON</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="search-no-results">Nu s-au găsit produse.</div>
            )}
          </div>
        )}
      </div>

      {showSort && (
        <div className="sort-container">
          <label htmlFor="sort-dropdown" className="sort-label">Sortează:</label>
          <select id="sort-dropdown" className="sort-dropdown" value={sortType} onChange={e => setSortType(e.target.value)}>
            <option value="default">Implicit</option>
            <option value="alpha-asc">Alfabetic (A-Z)</option>
            <option value="price-asc">Preț: Crescător</option>
            <option value="price-desc">Preț: Descrescător</option>
          </select>
        </div>
      )}
    </nav>
  );
}

function SiteHeader({ isDarkMode, onToggleTheme, fontFamily, onFontChange, cartCount, sortType, setSortType, showBackButton = false, products = [] }) {
  const navigate = useNavigate();

  return (
    <header className="site-header">
      <div className="header-bar">
        <div className="header-controls">
          {showBackButton && (
            <button type="button" className="back-btn" onClick={() => navigate('/')}>← Înapoi</button>
          )}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            title={isDarkMode ? 'Comută la modul luminos' : 'Comută la modul întunecat'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <select className="font-dropdown" value={fontFamily} onChange={onFontChange} title="Alege fontul">
            <option value="Arial, sans-serif">Arial (Default)</option>
            <option value="'Roboto', sans-serif">Roboto</option>
            <option value="'Open Sans', sans-serif">Open Sans</option>
            <option value="'Montserrat', sans-serif">Montserrat</option>
            <option value="'Poppins', sans-serif">Poppins</option>
          </select>
        </div>

        <button type="button" className="site-header-logo" style={{ ...ST.logo, fontSize: 60 }} onClick={() => navigate('/')}>
          Pc Garage
        </button>

        <HeaderMenu cartCount={cartCount} isDarkMode={isDarkMode} products={products} />
      </div>

      <StoreNavBar
        sortType={sortType}
        setSortType={setSortType}
        showSort={typeof setSortType === 'function'}
        products={products}
      />
    </header>
  );
}

export default SiteHeader;
