import React, { useState, useCallback } from 'react';
import './HomePage.css';
import ST from '../styles/styles';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/cart';

// ==========================================
// DATE PROCESOARE
// ==========================================
const intelModels = [
    { name: 'Core i3 12100F 3.3GHz', image: '/images/Corei312100F3.3GHz.png', price: 459.99 },
    { name: 'Core i3 13100F 3.4GHz', image: '/images/Corei313100F3.4GHz.png', price: 599.99 },
    { name: 'Core i5 12400F 2.5GHz', image: '/images/ProcesorIntelCorei512400F2.5GHzBox.png', price: 689.99 },
    { name: 'Core i5 13400F 2.5GHz', image: '/images/Corei513400F2.5GHz.png', price: 1049.99 },
    { name: 'Core i5 14400F 2.5GHz', image: '/images/Corei513400F2.5GHz.png', price: 1149.99 },
    { name: 'Core i5 13600KF 3.5GHz', image: '/images/intel-i5-13600kf.png', price: 1429.99 },
    { name: 'Core i7 13700K 3.4GHz', image: '/images/Corei713700K3.4GHz.png', price: 1999.99 },
    { name: 'Core i7 14700K 3.4GHz', image: '/images/Corei714700K3.4GHz.png', price: 2099.99 },
    { name: 'Core i9 14900KS 3.2GHz', image: '/images/Corei914900KS3.2GHz.png', price: 3299.99 },
    { name: 'Core Ultra 5 245K 4.2GHz', image: '/images/CoreUltra5245K4.2GHz.png', price: 1549.99 }
];

const amdModels = [
    { name: 'Ryzen 5 5500 3.6GHz', image: '/images/ProcesorAMDRyzen555003.6GHz Box.png', price: 429.99 },
    { name: 'Ryzen 5 5600 3.5GHz', image: '/images/ProcesorAMDRyzen556003.5GHzBox.png', price: 650.99 },
    { name: 'Ryzen 5 5600X 3.7GHz', image: '/images/ProcesorAMDRyzen556003.5GHzBox.png', price: 790.99 },
    { name: 'Ryzen 5 7600X 4.7GHz', image: '/images/Ryzen57600X4.7GHz.png', price: 1150.99 },
    { name: 'Ryzen 7 5700X 3.4GHz', image: '/images/Ryzen75700X3.4GHz.png', price: 990.99 },
    { name: 'Ryzen 7 5800X3D 3.4GHz', image: '/images/Ryzen75800X3D3.4GHz.png', price: 1450.99 },
    { name: 'Ryzen 7 7700 3.8GHz', image: '/images/Ryzen777003.8GHz.png', price: 1550.99 },
    { name: 'Ryzen 7 7700X 4.5GHz', image: '/images/Ryzen77700X4.5GHz.png', price: 1690.99 },
    { name: 'Ryzen 7 7800X3D 4.2GHz', image: '/images/Ryzen77800X3D4.2GHz.png', price: 1999.99 },
    { name: 'Ryzen 9 7950X3D 4.2GHz', image: '/images/Ryzen97950X3D4.2GHz.png', price: 3100.99 }
];

const mockProcessors = Array.from({ length: 20 }, (_, index) => {
    const isIntel = index % 2 === 0;
    const modelIndex = Math.floor(index / 2);
    let productData;

    if (isIntel) {
        productData = intelModels[modelIndex % intelModels.length];
        return {
            id: 'cpu-' + index,
            title: `Procesor Intel ${productData.name} Box`,
            price: productData.price,
            installments: Math.floor(productData.price / 4), 
            image: productData.image
        };
    } else {
        productData = amdModels[modelIndex % amdModels.length];
        return {
            id: 'cpu-' + index,
            title: `Procesor AMD ${productData.name} Box`,
            price: productData.price,
            installments: Math.floor(productData.price / 4), 
            image: productData.image
        };
    }
});

// ==========================================
// DATE PLĂCI VIDEO
// ==========================================
const nvidiaModels = [
    { name: 'GeForce RTX 3060 12GB', image: '/images/placi_vid/GeForceRTX306012GB.png', price: 1499.99 },
    { name: 'GeForce RTX 4060 8GB', image: '/images/placi_vid/GeForceRTX40608GB.png', price: 1649.99 },
    { name: 'GeForce RTX 4070 SUPER 12GB', image: '/images/placi_vid/GeForceRTX4070SUPER12GB.png', price: 3299.99 },
    { name: 'GeForce RTX 4080 SUPER 16GB', image: '/images/placi_vid/GeForceRTX4080SUPER16GB.png', price: 5499.99 },
    { name: 'GeForce RTX 4090 24GB', image: '/images/placi_vid/GeForceRTX409024GB.png', price: 9999.99 }
];

const amdGpuModels = [
    { name: 'Radeon RX 6600 8GB', image: '/images/placi_vid/RadeonRX66008GB.png', price: 1099.99 },
    { name: 'Radeon RX 7600 8GB', image: '/images/placi_vid/RadeonRX76008GB.png', price: 1449.99 },
    { name: 'Radeon RX 7700 XT 12GB', image: '/images/placi_vid/RadeonRX7700XT12GB.png', price: 2399.99 },
    { name: 'Radeon RX 7800 XT 16GB', image: '/images/placi_vid/RadeonRX7800XT16GB.png', price: 2799.99 },
    { name: 'Radeon RX 7900 XTX 24GB', image: '/images/placi_vid/RadeonRX7900XTX24GB.png', price: 5199.99 }
];

const mockGpus = Array.from({ length: 10 }, (_, index) => {
    const isNvidia = index % 2 === 0;
    const modelIndex = Math.floor(index / 2);
    let productData;

    if (isNvidia) {
        productData = nvidiaModels[modelIndex % nvidiaModels.length];
        return {
            id: 'gpu-nv-' + index,
            title: `Placa Video NVIDIA ${productData.name}`,
            price: productData.price,
            installments: Math.floor(productData.price / 4),
            image: productData.image
        };
    } else {
        productData = amdGpuModels[modelIndex % amdGpuModels.length];
        return {
            id: 'gpu-amd-' + index,
            title: `Placa Video AMD ${productData.name}`,
            price: productData.price,
            installments: Math.floor(productData.price / 4),
            image: productData.image
        };
    }
});

// ==========================================
// DATE PLĂCI DE BAZĂ
// ==========================================
const motherboardModels = [
    { name: 'GIGABYTE B650 EAGLE AX', image: '/images/placi_baza/GIGABYTEB650EAGLEAX.png', price: 799.99 },
    { name: 'ASUS TUF GAMING B550-PLUS', image: '/images/placi_baza/ASUSTUFGAMINGB550-PLUS.png', price: 659.99 },
    { name: 'MSI MAG Z790 TOMAHAWK WIFI', image: '/images/placi_baza/MSIMAGZ790TOMAHAWKWIFI.png', price: 1399.99 },
    { name: 'ASUS ROG STRIX B760-F GAMING', image: '/images/placi_baza/ASUSROGSTRIXB760-FGAMING.png', price: 1099.99 },
    { name: 'GIGABYTE B760M DS3H', image: '/images/placi_baza/GIGABYTEB760MDS3H.png', price: 549.99 }
];
const mockMotherboards = motherboardModels.map((productData, index) => ({
    id: 'mb-' + index,
    title: `Placa de baza ${productData.name}`,
    price: productData.price,
    installments: Math.floor(productData.price / 4),
    image: productData.image
}));

// ==========================================
// DATE SISTEME PRE-BUILD
// ==========================================
const pcSystemsModels = [
    { name: 'PC Gaming ZMEU Prime', image: '/images/sisteme/zmeu.png', price: 3499.99 },
    { name: 'PC Gaming BALAUR Epic MaxPlus', image: '/images/sisteme/balaur.png', price: 4299.99 },
    { name: 'PC Gaming DRAGON Legendar MaxPlus', image: '/images/sisteme/dragon.png', price: 6199.99 },
    { name: 'PC Gaming Arkay', image: '/images/sisteme/arkay.png', price: 3599.99 },
    { name: 'PC Gaming Sorcerer', image: '/images/sisteme/sorcerer.png', price: 5499.99 },
    { name: 'PC Gaming Serpent V2', image: '/images/sisteme/serpent-v2.png', price: 4199.99 },
    { name: 'PC Gaming Helix', image: '/images/sisteme/helix.png', price: 6499.99 },
    { name: 'PC Gaming Corvus', image: '/images/sisteme/corvus.png', price: 1499.99 },
    { name: 'PC Gaming Cerberus Powered by ASUS', image: '/images/sisteme/cerberus.png', price: 7999.99 },
    { name: 'PC Gaming Viking Intel', image: '/images/sisteme/viking-intel.png', price: 2199.99 }
];

const mockSystems = pcSystemsModels.map((productData, index) => ({
    id: 'sys-' + index,
    title: productData.name,
    price: productData.price,
    installments: Math.floor(productData.price / 4),
    image: productData.image
}));

// DEFINIREA SECȚIUNILOR PENTRU BARA DE SHORTCUTURI
const shortcuts = [
    { name: 'Sisteme Desktop PC', id: 'section-sisteme' },
    { name: 'Procesoare', id: 'section-procesoare' },
    { name: 'Plăci Video', id: 'section-placi-video' },
    { name: 'Plăci De Bază', id: 'section-placi-baza' }
];

// ==========================================
// COMPONENTA PRINCIPALĂ
// ==========================================
function HomePage() {
    const navigate = useNavigate();
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

    const handleFontChange = (e) => {
        const newFont = e.target.value;
        setFontFamily(newFont);
        localStorage.setItem('pc-garage-font', newFont);
    };

    const sortProducts = (products, type) => {
        const sortedArray = [...products];
        switch(type) {
            case 'price-asc':
                return sortedArray.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return sortedArray.sort((a, b) => b.price - a.price);
            case 'alpha-asc':
                return sortedArray.sort((a, b) => a.title.localeCompare(b.title));
            default:
                return sortedArray;
        }
    };

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
            <div className='header-bar'>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button 
                        className="theme-toggle-btn" 
                        onClick={toggleTheme} 
                        title={isDarkMode ? "Comută la modul luminos" : "Comută la modul întunecat"}
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>

                    <select className="font-dropdown" value={fontFamily} onChange={handleFontChange} title="Alege fontul">
                        <option value="Arial, sans-serif">Arial (Default)</option>
                        <option value="'Roboto', sans-serif">Roboto</option>
                        <option value="'Open Sans', sans-serif">Open Sans</option>
                        <option value="'Montserrat', sans-serif">Montserrat</option>
                        <option value="'Poppins', sans-serif">Poppins</option>
                    </select>
                </div>

                <h1 className='home-title'>Pc Garage</h1>
                <ListaOp cartCount={cartCount} />
            </div>

            <div className="shortcuts-bar">
                <div className="shortcut-links">
                    {shortcuts.map(shortcut => (
                        <a key={shortcut.id} href={`#${shortcut.id}`} className="shortcut-link">
                            {shortcut.name}
                        </a>
                    ))}
                </div>
                
                <div className="sort-container">
                    <label htmlFor="sort-dropdown" className="sort-label">Sortează:</label>
                    <select 
                        id="sort-dropdown" 
                        className="sort-dropdown"
                        value={sortType} 
                        onChange={(e) => setSortType(e.target.value)}
                    >
                        <option value="default">Implicit</option>
                        <option value="alpha-asc">Alfabetic (A-Z)</option>
                        <option value="price-asc">Preț: Crescător</option>
                        <option value="price-desc">Preț: Descrescător</option>
                    </select>
                </div>
            </div>
            
            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.msg}
                </div>
            )}

            <div className="main-content">
                <div className="category-section" id="section-sisteme">
                    <h2 className="section-title">SISTEME DESKTOP PC</h2>
                    <div className="product-grid">
                        {sortProducts(mockSystems, sortType).map(renderProduct)}
                    </div>
                </div>

                <div className="category-section" id="section-procesoare">
                    <h2 className="section-title">PROCESOARE</h2>
                    <div className="product-grid">
                        {sortProducts(mockProcessors, sortType).map(renderProduct)}
                    </div>
                </div>

                <div className="category-section" id="section-placi-video">
                    <h2 className="section-title">PLĂCI VIDEO</h2>
                    <div className="product-grid">
                        {sortProducts(mockGpus, sortType).map(renderProduct)}
                    </div>
                </div>

                <div className="category-section" id="section-placi-baza">
                    <h2 className="section-title">PLĂCI DE BAZĂ</h2>
                    <div className="product-grid">
                        {sortProducts(mockMotherboards, sortType).map(renderProduct)}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ListaOp({ cartCount }) {
    const navigate = useNavigate();
    return (
        <div style={{ display: 'flex', gap: 20 }}>
            <button
                style={{ ...ST.btn, padding: "10px 20px", fontSize: 16 }}
                onClick={() => navigate('/login')}
            >
                Log in
            </button>
            <button
                style={{ ...ST.btn, padding: "10px 20px", fontSize: 16 }}
                onClick={() => navigate('/register')}
            >
                Register
            </button>
            <button
                style={{ ...ST.btn, padding: "10px 20px", fontSize: 14 }}
                onClick={() => navigate('/cart')}
            >
                🛒 Cos {cartCount > 0 && `(${cartCount})`}
            </button>
        </div>
    );
}

export default HomePage;