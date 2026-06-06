jest.mock('../../repositories/UserRepository');
const UserRepository = require('../../repositories/UserRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test_secret';
process.env.JWT_EXPIRES_IN = '1h';

const AuthService = require('../../services/AuthService');
const repoInstance = UserRepository.mock.instances[0];

let hashedPassword;
beforeAll(async () => {
    hashedPassword = await bcrypt.hash('parola123', 10);
});

const fakeUserJSON = { id: 1, name: 'Ion', email: 'ion@test.ro', role: 'client' };

const makeFakeUser = (overrides = {}) => ({
    id: 1,
    role: 'client',
    level: null,
    active: true,
    getPassword: () => hashedPassword,
    toJSON: () => fakeUserJSON,
    canManageEmployees: () => false,
    ...overrides,
});

beforeEach(() => {
    jest.clearAllMocks();
    repoInstance.findByEmail = jest.fn().mockResolvedValue(null);
    repoInstance.findById    = jest.fn().mockResolvedValue(null);
    repoInstance.create      = jest.fn().mockResolvedValue(makeFakeUser());
});

// ── register ──────────────────────────────────────────────────────────────────

describe('register', () => {
    it('returns user and token on success', async () => {
        const result = await AuthService.register({ name: 'Ion', email: 'ion@test.ro', password: 'parola123' });
        expect(result).toHaveProperty('token');
        expect(result.user).toEqual(fakeUserJSON);
    });

    

    
});

// ── registerEmployee ──────────────────────────────────────────────────────────

describe('registerEmployee', () => {
    const manager = makeFakeUser({ role: 'manager', canManageEmployees: () => true });

    it('registers employee for manager', async () => {
        const result = await AuthService.registerEmployee(
            { name: 'Maria', email: 'maria@test.ro', password: '123' }, manager
        );
        expect(result).toEqual(fakeUserJSON);
    });

    
});

// ── login ─────────────────────────────────────────────────────────────────────

describe('login', () => {
    it('returns user and token with valid credentials', async () => {
        repoInstance.findByEmail = jest.fn().mockResolvedValue(makeFakeUser());
        const result = await AuthService.login('ion@test.ro', 'parola123');
        expect(result).toHaveProperty('token');
        expect(result.user).toEqual(fakeUserJSON);
    });

    
});

