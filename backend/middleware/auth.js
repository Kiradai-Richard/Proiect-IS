const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');

const userRepo = new UserRepository();

class AuthMiddleware {
  static async authenticate(req, res, next) {
    try {
      const header = req.headers.authorization;
      if (!header || !header.startsWith('Bearer '))
        return res.status(401).json({ error: 'Token lipsa' });
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userRepo.findById(decoded.id);
      if (!user || !user.active)
        return res.status(401).json({ error: 'Token invalid' });
      req.user = user;
      next();
    } catch {
      return res.status(401).json({ error: 'Token invalid sau expirat' });
    }
  }

  static requireRole(...roles) {
    return (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role))
        return res.status(403).json({ error: 'Acces interzis' });
      next();
    };
  }

  static requireStaff(req, res, next) {
    if (!req.user || req.user.role === 'client')
      return res.status(403).json({ error: 'Acces interzis - doar staff' });
    next();
  }

  static requirePermission(method) {
    return (req, res, next) => {
      if (!req.user || !req.user[method]?.())
        return res.status(403).json({ error: 'Acces interzis' });
      next();
    };
  }
}

module.exports = AuthMiddleware;
