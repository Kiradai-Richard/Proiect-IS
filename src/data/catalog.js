const rochiiFemei = [
    { name: 'Rochie Eleganta Neagra',   image: 'https://placehold.co/300x400/1a1a2e/ffffff?text=Rochie+Eleganta', price: 299.99 },
    { name: 'Rochie Florala Vara',       image: 'https://placehold.co/300x400/f9a8d4/1a1a2e?text=Rochie+Florala', price: 189.99 },
    { name: 'Rochie Midi Bordo',         image: 'https://placehold.co/300x400/7f1d1d/ffffff?text=Rochie+Midi', price: 249.99 },
    { name: 'Rochie Mini Albastru Navy', image: 'https://placehold.co/300x400/1e3a5f/ffffff?text=Rochie+Mini', price: 179.99 },
    { name: 'Rochie Cocktail Verde',     image: 'https://placehold.co/300x400/14532d/ffffff?text=Rochie+Cocktail', price: 329.99 },
    { name: 'Rochie Casual Bej',         image: 'https://placehold.co/300x400/d6b99a/1a1a2e?text=Rochie+Casual', price: 159.99 },
    { name: 'Rochie Seara Argintie',     image: 'https://placehold.co/300x400/9ca3af/1a1a2e?text=Rochie+Seara', price: 449.99 },
    { name: 'Rochie Wrap Print Animal',  image: 'https://placehold.co/300x400/78350f/ffffff?text=Rochie+Wrap', price: 199.99 },
    { name: 'Rochie Maxi Boho',          image: 'https://placehold.co/300x400/c4b5fd/1a1a2e?text=Rochie+Maxi', price: 279.99 },
    { name: 'Rochie Office Gri',         image: 'https://placehold.co/300x400/4b5563/ffffff?text=Rochie+Office', price: 219.99 },
];

const tricouriBasic = [
    { name: 'Tricou Basic Alb',         image: 'https://placehold.co/300x400/f9fafb/1a1a2e?text=Tricou+Alb', price: 59.99 },
    { name: 'Tricou Basic Negru',        image: 'https://placehold.co/300x400/111827/ffffff?text=Tricou+Negru', price: 59.99 },
    { name: 'Tricou Oversize Gri',       image: 'https://placehold.co/300x400/6b7280/ffffff?text=Tricou+Oversize', price: 79.99 },
    { name: 'Tricou Polo Bleumarin',     image: 'https://placehold.co/300x400/1e3a5f/ffffff?text=Tricou+Polo', price: 89.99 },
    { name: 'Tricou Printed Street',     image: 'https://placehold.co/300x400/4c1d95/ffffff?text=Tricou+Print', price: 69.99 },
    { name: 'Tricou Crop Top Roz',       image: 'https://placehold.co/300x400/fce7f3/1a1a2e?text=Crop+Top', price: 64.99 },
    { name: 'Tricou Vintage Wash',       image: 'https://placehold.co/300x400/78350f/ffffff?text=Vintage+Wash', price: 74.99 },
    { name: 'Tricou Tie-Dye Multicolor', image: 'https://placehold.co/300x400/7c3aed/ffffff?text=Tie-Dye', price: 69.99 },
    { name: 'Tricou Baseball Alb-Negru', image: 'https://placehold.co/300x400/374151/ffffff?text=Baseball', price: 79.99 },
    { name: 'Tricou Henley Camel',       image: 'https://placehold.co/300x400/b45309/ffffff?text=Henley', price: 84.99 },
];

const tricouriPremium = [
    { name: 'Tricou Premium Linen Alb',     image: 'https://placehold.co/300x400/f3f4f6/1a1a2e?text=Linen+Alb', price: 99.99 },
    { name: 'Tricou Merino Wool Navy',       image: 'https://placehold.co/300x400/1e3a5f/ffffff?text=Merino+Navy', price: 149.99 },
    { name: 'Tricou Supima Cotton Verde',    image: 'https://placehold.co/300x400/166534/ffffff?text=Supima+Verde', price: 119.99 },
    { name: 'Tricou Bamboo Soft Crem',       image: 'https://placehold.co/300x400/fef3c7/1a1a2e?text=Bamboo+Crem', price: 109.99 },
    { name: 'Tricou Long Line Negru',        image: 'https://placehold.co/300x400/0f172a/ffffff?text=Long+Line', price: 89.99 },
    { name: 'Tricou Graphic Art Print',      image: 'https://placehold.co/300x400/8B5CF6/ffffff?text=Graphic+Art', price: 94.99 },
    { name: 'Tricou Tie-Shoulder Lavanda',   image: 'https://placehold.co/300x400/ddd6fe/1a1a2e?text=Lavanda', price: 99.99 },
    { name: 'Tricou Rib Knit Terracota',     image: 'https://placehold.co/300x400/9a3412/ffffff?text=Rib+Knit', price: 84.99 },
    { name: 'Tricou Broderie Florala',       image: 'https://placehold.co/300x400/EC4899/ffffff?text=Broderie', price: 114.99 },
    { name: 'Tricou Satin Touch Champagne',  image: 'https://placehold.co/300x400/d4b896/1a1a2e?text=Satin', price: 129.99 },
];

export const mockProcessors = Array.from({ length: 20 }, (_, index) => {
    const isBasic = index % 2 === 0;
    const modelIndex = Math.floor(index / 2);
    const productData = isBasic
        ? tricouriBasic[modelIndex % tricouriBasic.length]
        : tricouriPremium[modelIndex % tricouriPremium.length];

    return {
        id: 'tricou-' + index,
        title: productData.name,
        price: productData.price,
        installments: Math.floor(productData.price / 4),
        image: productData.image
    };
});

const pantaloniModels = [
    { name: 'Pantaloni Skinny Negri',   image: 'https://placehold.co/300x400/1a1a2e/ffffff?text=Skinny+Negri', price: 149.99 },
    { name: 'Pantaloni Wide Leg Bej',   image: 'https://placehold.co/300x400/d6b99a/1a1a2e?text=Wide+Leg', price: 189.99 },
    { name: 'Pantaloni Jogger Gri',     image: 'https://placehold.co/300x400/6b7280/ffffff?text=Jogger+Gri', price: 119.99 },
    { name: 'Pantaloni Cargo Kaki',     image: 'https://placehold.co/300x400/4d7c0f/ffffff?text=Cargo+Kaki', price: 159.99 },
    { name: 'Pantaloni Palazzo Albi',   image: 'https://placehold.co/300x400/f9fafb/1a1a2e?text=Palazzo', price: 169.99 },
];

const jeansModels = [
    { name: 'Jeans Slim Fit Albastru',  image: 'https://placehold.co/300x400/1d4ed8/ffffff?text=Slim+Fit', price: 199.99 },
    { name: 'Pantaloni Culottes Roz',   image: 'https://placehold.co/300x400/fbcfe8/1a1a2e?text=Culottes', price: 144.99 },
    { name: 'Jeans Mom Fit Vintage',    image: 'https://placehold.co/300x400/1e3a5f/ffffff?text=Mom+Fit', price: 219.99 },
    { name: 'Pantaloni Piele Eco Negri',image: 'https://placehold.co/300x400/111827/ffffff?text=Piele+Eco', price: 249.99 },
    { name: 'Jeans Bootcut Indigo',     image: 'https://placehold.co/300x400/312e81/ffffff?text=Bootcut', price: 189.99 },
];

export const mockGpus = Array.from({ length: 10 }, (_, index) => {
    const isPantaloni = index % 2 === 0;
    const modelIndex = Math.floor(index / 2);
    const productData = isPantaloni
        ? pantaloniModels[modelIndex % pantaloniModels.length]
        : jeansModels[modelIndex % jeansModels.length];

    return {
        id: isPantaloni ? 'pant-' + index : 'jeans-' + index,
        title: productData.name,
        price: productData.price,
        installments: Math.floor(productData.price / 4),
        image: productData.image
    };
});

const geciModels = [
    { name: 'Geaca Denim Classic',      image: 'https://placehold.co/300x400/1d4ed8/ffffff?text=Geaca+Denim', price: 349.99 },
    { name: 'Geaca Piele Eco Neagra',   image: 'https://placehold.co/300x400/111827/ffffff?text=Piele+Eco', price: 499.99 },
    { name: 'Geaca Bomber Kaki',        image: 'https://placehold.co/300x400/4d7c0f/ffffff?text=Bomber+Kaki', price: 299.99 },
    { name: 'Geaca Trench Bej',         image: 'https://placehold.co/300x400/d6b99a/1a1a2e?text=Trench+Bej', price: 449.99 },
    { name: 'Geaca Puffer Oversized',   image: 'https://placehold.co/300x400/8B5CF6/ffffff?text=Puffer', price: 399.99 },
];

export const mockMotherboards = geciModels.map((productData, index) => ({
    id: 'geaca-' + index,
    title: productData.name,
    price: productData.price,
    installments: Math.floor(productData.price / 4),
    image: productData.image
}));

export const mockSystems = rochiiFemei.map((productData, index) => ({
    id: 'rochie-' + index,
    title: productData.name,
    price: productData.price,
    installments: Math.floor(productData.price / 4),
    image: productData.image
}));

export const categoryShortcuts = [
    { name: 'Rochii', id: 'section-sisteme' },
    { name: 'Tricouri', id: 'section-procesoare' },
    { name: 'Pantaloni & Jeans', id: 'section-placi-video' },
    { name: 'Geci', id: 'section-placi-baza' }
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
