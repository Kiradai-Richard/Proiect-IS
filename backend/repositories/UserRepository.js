const BaseRepository = require('./BaseRepository');
const { User } = require('../models/User');

class UserRepository extends BaseRepository {
  constructor() { super('users'); }

  _toModel(row) { return User.create(row); }

  async findByEmail(email) {
    const rows = await this.rawQuery('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return null;
    return this._toModel(rows[0]);
  }

  async findAllStaff() {
    const rows = await this.rawQuery(
      "SELECT * FROM users WHERE role IN ('manager','employee') AND active = 1 ORDER BY created_at DESC"
    );
    return rows.map(r => this._toModel(r));
  }
}

module.exports = UserRepository;
