const BaseRepository = require('./BaseRepository');
const { Promotion } = require('../models/Promotion');

class PromotionRepository extends BaseRepository {
  constructor() { super('promotions'); }

  _toModel(row) { return new Promotion(row); }

  async findById(id) {
    const rows = await this.rawQuery(`
      SELECT pr.*, p.name AS product_name
      FROM promotions pr
      LEFT JOIN products p ON pr.product_id = p.id
      WHERE pr.id = ?
    `, [id]);
    if (!rows.length) return null;
    return this._toModel(rows[0]);
  }

  async findActive() {
    const rows = await this.rawQuery(`
      SELECT pr.*, p.name AS product_name
      FROM promotions pr
      LEFT JOIN products p ON pr.product_id = p.id
      WHERE pr.active = 1
    `);
    return rows.map(r => this._toModel(r));
  }

  async findAll() {
    const rows = await this.rawQuery(`
      SELECT pr.*, p.name AS product_name
      FROM promotions pr
      LEFT JOIN products p ON pr.product_id = p.id
      ORDER BY pr.created_at DESC
    `);
    return rows.map(r => this._toModel(r));
  }
}

module.exports = PromotionRepository;
