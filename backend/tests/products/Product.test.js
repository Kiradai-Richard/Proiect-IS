const { Product, PrebuiltSystem, Component } = require('../../models/Product');

const base = { id: 1, name: 'RTX 4090', category_id: 2, product_type: 'component', price: '1000', stock: 5 };

describe('Product', () => {
    it('is abstract', () => {
        expect(() => new Product(base)).toThrow('Product este abstract');
    });

    it('converts price to number', () => {
        const p = new Component({ ...base });
        expect(p.price).toBe(1000);
    });

    it('defaults active to true', () => {
        const p = new Component({ ...base });
        expect(p.active).toBe(true);
    });

    it('casts active 0 to false', () => {
        const p = new Component({ ...base, active: 0 });
        expect(p.active).toBe(false);
    });

    it('parses specs from JSON string', () => {
        const p = new Component({ ...base, specs: '{"compatibility":"AM5"}' });
        expect(p.specs).toEqual({ compatibility: 'AM5' });
    });

    it('accepts specs as object', () => {
        const p = new Component({ ...base, specs: { compatibility: 'AM5' } });
        expect(p.specs).toEqual({ compatibility: 'AM5' });
    });

    it('defaults specs to empty object', () => {
        const p = new Component({ ...base });
        expect(p.specs).toEqual({});
    });

    it('getInstallments returns floor(price / 4)', () => {
        const p = new Component({ ...base, price: 1000 });
        expect(p.getInstallments()).toBe(250);
    });

    it('toJSON includes installments', () => {
        const p = new Component({ ...base, price: 1000 });
        expect(p.toJSON().installments).toBe(250);
    });
});

describe('Product.create factory', () => {
    it('creates PrebuiltSystem for type system', () => {
        const p = Product.create({ ...base, product_type: 'system' });
        expect(p).toBeInstanceOf(PrebuiltSystem);
    });

    it('creates Component for type component', () => {
        const p = Product.create({ ...base, product_type: 'component' });
        expect(p).toBeInstanceOf(Component);
    });

    it('throws for unknown type', () => {
        expect(() => Product.create({ ...base, product_type: 'unknown' }))
            .toThrow('Tip produs necunoscut: unknown');
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

    it('getCompatibilityNotes returns empty string when not set', () => {
        const p = new Component({ ...base });
        expect(p.getCompatibilityNotes()).toBe('');
    });
});