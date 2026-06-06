const { User, Manager, SeniorEmployee, JuniorEmployee, Client } = require('../../models/User');

const base = { id: 1, name: 'Test', email: 'test@test.com', password: 'hash', role: 'client' };

describe('User', () => {
    it('is abstract — cannot be instantiated directly', () => {
        expect(() => new User(base)).toThrow('User este abstract');
    });

    it('getPassword returns the password', () => {
        const u = new Client({ ...base });
        expect(u.getPassword()).toBe('hash');
    });

    it('password is not exposed in toJSON', () => {
        const u = new Client({ ...base });
        expect(u.toJSON()).not.toHaveProperty('password');
    });

    it('defaults active to true when not provided', () => {
        const u = new Client({ ...base });
        expect(u.active).toBe(true);
    });

    it('casts active 0 to false', () => {
        const u = new Client({ ...base, active: 0 });
        expect(u.active).toBe(false);
    });
});

describe('User.create factory', () => {
    it('creates Manager for role manager', () => {
        const u = User.create({ ...base, role: 'manager' });
        expect(u).toBeInstanceOf(Manager);
    });

    it('creates SeniorEmployee for employee + senior', () => {
        const u = User.create({ ...base, role: 'employee', level: 'senior' });
        expect(u).toBeInstanceOf(SeniorEmployee);
    });

    it('creates JuniorEmployee for employee + junior', () => {
        const u = User.create({ ...base, role: 'employee', level: 'junior' });
        expect(u).toBeInstanceOf(JuniorEmployee);
    });

    it('creates Client for role client', () => {
        const u = User.create({ ...base, role: 'client' });
        expect(u).toBeInstanceOf(Client);
    });

    it('throws for unknown role', () => {
        expect(() => User.create({ ...base, role: 'alien' })).toThrow('Rol necunoscut: alien');
    });
});

describe('Manager permissions', () => {
    const m = new Manager({ ...base, role: 'manager' });
    it.each([
        ['canManageEmployees', true],
        ['canManageProducts',  true],
        ['canDeleteProducts',  true],
        ['canManagePromotions',true],
        ['canHandleOrders',    true],
        ['canViewStats',       true],
        ['canPlaceOrders',     false],
    ])('%s → %s', (method, expected) => {
        expect(m[method]()).toBe(expected);
    });
});

describe('SeniorEmployee permissions', () => {
    const s = new SeniorEmployee({ ...base, role: 'employee', level: 'senior' });
    it.each([
        ['canManageEmployees', false],
        ['canManageProducts',  true],
        ['canDeleteProducts',  false],
        ['canManagePromotions',true],
        ['canHandleOrders',    true],
        ['canViewStats',       true],
        ['canPlaceOrders',     false],
    ])('%s → %s', (method, expected) => {
        expect(s[method]()).toBe(expected);
    });
});

describe('JuniorEmployee permissions', () => {
    const j = new JuniorEmployee({ ...base, role: 'employee', level: 'junior' });
    it.each([
        ['canManageEmployees', false],
        ['canManageProducts',  false],
        ['canDeleteProducts',  false],
        ['canManagePromotions',false],
        ['canHandleOrders',    true],
        ['canViewStats',       false],
        ['canPlaceOrders',     false],
    ])('%s → %s', (method, expected) => {
        expect(j[method]()).toBe(expected);
    });
});

describe('Client permissions', () => {
    const c = new Client({ ...base });
    it.each([
        ['canManageEmployees', false],
        ['canManageProducts',  false],
        ['canHandleOrders',    false],
        ['canPlaceOrders',     true],
    ])('%s → %s', (method, expected) => {
        expect(c[method]()).toBe(expected);
    });
});