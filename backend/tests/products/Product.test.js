const { Product, PrebuiltSystem, Component } = require('../../models/Product');

const base = { id: 1, name: 'RTX 4090', category_id: 2, product_type: 'component', price: '1000', stock: 5 };

describe('Product', () => {
    it('is abstract', () => {
        expect(() => new Product(base)).toThrow('Product este abstract');
    });
});

describe('Product.create factory', () => {
    it('creates Component for type component', () => {
        const p = Product.create({ ...base, product_type: 'component' });
        expect(p).toBeInstanceOf(Component);
    });
});

describe('PrebuiltSystem', () => {
    it('getWarranty returns 2 ani', () => {
        const p = new PrebuiltSystem({ ...base, product_type: 'system' });
        expect(p.getWarranty()).toBe('2 ani');
    });
});

describe('Component', () => {
    it('getCompatibilityNotes returns specs.compatibility', () => {
        const p = new Component({ ...base, specs: { compatibility: 'AM5' } });
        expect(p.getCompatibilityNotes()).toBe('AM5');
    });
});