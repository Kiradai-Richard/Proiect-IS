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

    it('defaults total to 0 when missing', () => {
        const o = new PurchaseOrder({ ...base, total: null });
        expect(o.total).toBe(0);
    });
});

describe('Order.create factory', () => {
    it('creates PurchaseOrder for type purchase', () => {
        const o = Order.create({ ...base, order_type: 'purchase' });
        expect(o).toBeInstanceOf(PurchaseOrder);
    });
});

describe('PurchaseOrder', () => {
    it('canBeCancelled is true when pending', () => {
        const o = new PurchaseOrder({ ...base, status: 'pending' });
        expect(o.canBeCancelled()).toBe(true);
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
});