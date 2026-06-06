const { Order, PurchaseOrder, ServiceOrder } = require('../../models/Order');

const base = {
    id: 1, user_id: 2, ticket_number: 5,
    customer_name: 'Ion', customer_email: 'ion@test.ro',
    customer_phone: '0700', customer_address: 'Str. X',
    total: '299.99', status: 'pending',
};

describe('Order', () => {
    it('is abstract', () => {
        expect(() => new Order(base)).toThrow('Order este abstract');
    });

    it('converts total to number', () => {
        const o = new PurchaseOrder({ ...base });
        expect(o.total).toBe(299.99);
    });

    it('defaults total to 0 when missing', () => {
        const o = new PurchaseOrder({ ...base, total: null });
        expect(o.total).toBe(0);
    });

    it('defaults status to pending', () => {
        const o = new PurchaseOrder({ ...base, status: undefined });
        expect(o.status).toBe('pending');
    });

    it('defaults items to empty array', () => {
        const o = new PurchaseOrder({ ...base });
        expect(o.items).toEqual([]);
    });

    it('sets ticketNumber to null when missing', () => {
        const o = new PurchaseOrder({ ...base, ticket_number: undefined });
        expect(o.ticketNumber).toBeNull();
    });
});

describe('Order.create factory', () => {
    it('creates PurchaseOrder for type purchase', () => {
        const o = Order.create({ ...base, order_type: 'purchase' });
        expect(o).toBeInstanceOf(PurchaseOrder);
    });

    it('creates ServiceOrder for type service', () => {
        const o = Order.create({ ...base, order_type: 'service' });
        expect(o).toBeInstanceOf(ServiceOrder);
    });

    it('throws for unknown type', () => {
        expect(() => Order.create({ ...base, order_type: 'unknown' }))
            .toThrow('Tip comanda necunoscut: unknown');
    });
});

describe('PurchaseOrder', () => {
    it('canBeCancelled is true when pending', () => {
        const o = new PurchaseOrder({ ...base, status: 'pending' });
        expect(o.canBeCancelled()).toBe(true);
    });

    it('canBeCancelled is false when not pending', () => {
        const o = new PurchaseOrder({ ...base, status: 'shipped' });
        expect(o.canBeCancelled()).toBe(false);
    });
});

describe('ServiceOrder', () => {
    it('getScheduledDate returns serviceDate', () => {
        const o = new ServiceOrder({ ...base, order_type: 'service', service_date: '2025-12-01' });
        expect(o.getScheduledDate()).toBe('2025-12-01');
    });
});

describe('formatDateField via toJSON', () => {
    it('formats a date string correctly', () => {
        const o = new ServiceOrder({ ...base, order_type: 'service', service_date: '2025-06-15' });
        expect(o.toJSON().serviceDate).toBe('2025-06-15');
    });

    it('returns null when serviceDate is missing', () => {
        const o = new ServiceOrder({ ...base, order_type: 'service' });
        expect(o.toJSON().serviceDate).toBeNull();
    });

    it('handles Date object', () => {
        const o = new ServiceOrder({ ...base, order_type: 'service', service_date: new Date('2025-06-15') });
        expect(o.toJSON().serviceDate).toBe('2025-06-15');
    });
});