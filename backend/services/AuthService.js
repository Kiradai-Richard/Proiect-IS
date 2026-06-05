const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');

const userRepo = new UserRepository();

class AuthService {
  async register(data) {
    if (!data.name || !data.email || !data.password) throw new Error('Campuri obligatorii lipsa');
    const existing = await userRepo.findByEmail(data.email);
    if (existing) throw new Error('Email deja folosit');
    const hash = await bcrypt.hash(data.password, 10);
    const user = await userRepo.create({
      name: data.name,
      email: data.email,
      password: hash,
      role: 'client',
      phone: data.phone || null,
      address: data.address || null,
      active: 1,
    });
    const token = this._generateToken(user);
    return { user: user.toJSON(), token };
  }

  async registerEmployee(data, requestingUser) {
    if (!requestingUser.canManageEmployees()) throw new Error('Acces interzis');
    if (!data.name || !data.email || !data.password) throw new Error('Campuri obligatorii lipsa');
    const existing = await userRepo.findByEmail(data.email);
    if (existing) throw new Error('Email deja folosit');
    const hash = await bcrypt.hash(data.password, 10);
    const user = await userRepo.create({
      name: data.name,
      email: data.email,
      password: hash,
      role: 'employee',
      level: data.level || 'junior',
      department: data.department || null,
      phone: data.phone || null,
      active: 1,
    });
    return user.toJSON();
  }

  async login(email, password) {
    if (!email || !password) throw new Error('Email si parola sunt obligatorii');
    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error('Credentiale invalide');
    const valid = await bcrypt.compare(password, user.getPassword());
    if (!valid) throw new Error('Credentiale invalide');
    if (!user.active) throw new Error('Contul este dezactivat');
    const token = this._generateToken(user);
    return { user: user.toJSON(), token };
  }

  async getProfile(id) {
    const user = await userRepo.findById(id);
    if (!user) throw new Error('User negasit');
    return user.toJSON();
  }

  _generateToken(user) {
    return jwt.sign(
      { id: user.id, role: user.role, level: user.level },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }
}

module.exports = new AuthService();
