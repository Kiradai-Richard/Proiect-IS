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

    it('throws if name missing', async () => {
        await expect(AuthService.register({ email: 'x@x.ro', password: '123' }))
            .rejects.toThrow('Campuri obligatorii lipsa');
    });

    it('throws if email missing', async () => {
        await expect(AuthService.register({ name: 'X', password: '123' }))
            .rejects.toThrow('Campuri obligatorii lipsa');
    });

    it('throws if password missing', async () => {
        await expect(AuthService.register({ name: 'X', email: 'x@x.ro' }))
            .rejects.toThrow('Campuri obligatorii lipsa');
    });

    it('throws if email already used', async () => {
        repoInstance.findByEmail = jest.fn().mockResolvedValue(makeFakeUser());
        await expect(AuthService.register({ name: 'X', email: 'ion@test.ro', password: '123' }))
            .rejects.toThrow('Email deja folosit');
    });

    it('stores a bcrypt hash, not plaintext', async () => {
        await AuthService.register({ name: 'Ion', email: 'ion@test.ro', password: 'parola123' });
        const saved = repoInstance.create.mock.calls[0][0].password;
        expect(saved).not.toBe('parola123');
        expect(await bcrypt.compare('parola123', saved)).toBe(true);
    });

    it('always registers as client role', async () => {
        await AuthService.register({ name: 'Ion', email: 'ion@test.ro', password: '123', role: 'manager' });
        expect(repoInstance.create.mock.calls[0][0].role).toBe('client');
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

    it('defaults level to junior', async () => {
        await AuthService.registerEmployee(
            { name: 'Maria', email: 'maria@test.ro', password: '123' }, manager
        );
        expect(repoInstance.create.mock.calls[0][0].level).toBe('junior');
    });

    it('throws for non-manager', async () => {
        await expect(AuthService.registerEmployee(
            { name: 'X', email: 'x@x.ro', password: '123' }, makeFakeUser()
        )).rejects.toThrow('Acces interzis');
    });

    it('throws if email already used', async () => {
        repoInstance.findByEmail = jest.fn().mockResolvedValue(makeFakeUser());
        await expect(AuthService.registerEmployee(
            { name: 'X', email: 'ion@test.ro', password: '123' }, manager
        )).rejects.toThrow('Email deja folosit');
    });

    it('throws if required fields missing', async () => {
        await expect(AuthService.registerEmployee({ name: 'X' }, manager))
            .rejects.toThrow('Campuri obligatorii lipsa');
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

    it('token contains id and role', async () => {
        repoInstance.findByEmail = jest.fn().mockResolvedValue(makeFakeUser());
        const { token } = await AuthService.login('ion@test.ro', 'parola123');
        const decoded = jwt.verify(token, 'test_secret');
        expect(decoded.id).toBe(1);
        expect(decoded.role).toBe('client');
    });

    it('throws if email missing', async () => {
        await expect(AuthService.login('', 'parola123'))
            .rejects.toThrow('Email si parola sunt obligatorii');
    });

    it('throws if password missing', async () => {
        await expect(AuthService.login('ion@test.ro', ''))
            .rejects.toThrow('Email si parola sunt obligatorii');
    });

    it('throws if user not found', async () => {
        await expect(AuthService.login('ghost@test.ro', '123'))
            .rejects.toThrow('Credentiale invalide');
    });

    it('throws if password wrong', async () => {
        repoInstance.findByEmail = jest.fn().mockResolvedValue(makeFakeUser());
        await expect(AuthService.login('ion@test.ro', 'gresit'))
            .rejects.toThrow('Credentiale invalide');
    });

    it('throws if account inactive', async () => {
        repoInstance.findByEmail = jest.fn().mockResolvedValue(makeFakeUser({ active: false }));
        await expect(AuthService.login('ion@test.ro', 'parola123'))
            .rejects.toThrow('Contul este dezactivat');
    });
});

// ── getProfile ────────────────────────────────────────────────────────────────

describe('getProfile', () => {
    it('returns user JSON for valid id', async () => {
        repoInstance.findById = jest.fn().mockResolvedValue(makeFakeUser());
        const result = await AuthService.getProfile(1);
        expect(result).toEqual(fakeUserJSON);
    });

    it('throws if user not found', async () => {
        await expect(AuthService.getProfile(99)).rejects.toThrow('User negasit');
    });
});