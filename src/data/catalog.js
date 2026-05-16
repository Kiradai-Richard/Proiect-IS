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

export const mockProcessors = Array.from({ length: 20 }, (_, index) => {
    const isIntel = index % 2 === 0;
    const modelIndex = Math.floor(index / 2);
    const productData = isIntel
        ? intelModels[modelIndex % intelModels.length]
        : amdModels[modelIndex % amdModels.length];

    return {
        id: 'cpu-' + index,
        title: isIntel
            ? `Procesor Intel ${productData.name} Box`
            : `Procesor AMD ${productData.name} Box`,
        price: productData.price,
        installments: Math.floor(productData.price / 4),
        image: productData.image
    };
});

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

export const mockGpus = Array.from({ length: 10 }, (_, index) => {
    const isNvidia = index % 2 === 0;
    const modelIndex = Math.floor(index / 2);
    const productData = isNvidia
        ? nvidiaModels[modelIndex % nvidiaModels.length]
        : amdGpuModels[modelIndex % amdGpuModels.length];

    return {
        id: isNvidia ? 'gpu-nv-' + index : 'gpu-amd-' + index,
        title: isNvidia
            ? `Placa Video NVIDIA ${productData.name}`
            : `Placa Video AMD ${productData.name}`,
        price: productData.price,
        installments: Math.floor(productData.price / 4),
        image: productData.image
    };
});

const motherboardModels = [
    { name: 'GIGABYTE B650 EAGLE AX', image: '/images/placi_baza/GIGABYTEB650EAGLEAX.png', price: 799.99 },
    { name: 'ASUS TUF GAMING B550-PLUS', image: '/images/placi_baza/ASUSTUFGAMINGB550-PLUS.png', price: 659.99 },
    { name: 'MSI MAG Z790 TOMAHAWK WIFI', image: '/images/placi_baza/MSIMAGZ790TOMAHAWKWIFI.png', price: 1399.99 },
    { name: 'ASUS ROG STRIX B760-F GAMING', image: '/images/placi_baza/ASUSROGSTRIXB760-FGAMING.png', price: 1099.99 },
    { name: 'GIGABYTE B760M DS3H', image: '/images/placi_baza/GIGABYTEB760MDS3H.png', price: 549.99 }
];

export const mockMotherboards = motherboardModels.map((productData, index) => ({
    id: 'mb-' + index,
    title: `Placa de baza ${productData.name}`,
    price: productData.price,
    installments: Math.floor(productData.price / 4),
    image: productData.image
}));

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

export const mockSystems = pcSystemsModels.map((productData, index) => ({
    id: 'sys-' + index,
    title: productData.name,
    price: productData.price,
    installments: Math.floor(productData.price / 4),
    image: productData.image
}));

export const categoryShortcuts = [
    { name: 'Sisteme Desktop PC', id: 'section-sisteme' },
    { name: 'Procesoare', id: 'section-procesoare' },
    { name: 'Plăci Video', id: 'section-placi-video' },
    { name: 'Plăci De Bază', id: 'section-placi-baza' }
];

export const allProducts = [
    ...mockSystems,
    ...mockProcessors,
    ...mockGpus,
    ...mockMotherboards
];

export function matchesSearchQuery(product, query) {
    const term = query.trim().toLowerCase();
    if (!term) return true;
    return product.title.toLowerCase().includes(term);
}
