const { Promotion } = require('../../models/Promotion');

describe('Promotion model', () => {
    it('maps snake_case fields to camelCase', () => {
        const p = new Promotion({ id: 1, name: 'Test', product_id: 2, discount_percent: 20, active: 1, created_by: 3 });
        expect(p.productId).toBe(2);
        expect(p.discountPercent).toBe(20);
        expect(p.createdBy).toBe(3);
    });

    it('defaults discountPercent to 10', () => {
        const p = new Promotion({ id: 1, name: 'X', product_id: 1, created_by: 1 });
        expect(p.discountPercent).toBe(10);
    });

    it('toJSON returns camelCase and no snake_case leaking', () => {
        const p = new Promotion({ id: 1, name: 'X', product_id: 2, created_by: 1 });
        const json = p.toJSON();
        expect(json).toHaveProperty('productId', 2);
        expect(json).toHaveProperty('createdBy', 1);
        expect(json).not.toHaveProperty('product_id');
        expect(json).not.toHaveProperty('created_by');
    });

    it('includes product_name when provided', () => {
        const p = new Promotion({ id: 1, name: 'X', product_id: 2, product_name: 'RTX 4090', created_by: 1 });
        expect(p.productName).toBe('RTX 4090');
    });
});