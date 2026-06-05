const BaseRepository = require('./BaseRepository');
const { Product } = require('../models/Product');

class ProductRepository extends BaseRepository {
  constructor() { super('products'); }

  _toModel(row) { return Product.create(row); }

  async findAll(filters = {}) {
    let sql = `
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.active = 1
    `;
    const values = [];

    if (filters.category) { sql += ' AND c.slug = ?'; values.push(filters.category); }
    if (filters.search)   { sql += ' AND p.name LIKE ?'; values.push(`%${filters.search}%`); }

    if (filters.sort === 'price-asc')  sql += ' ORDER BY p.price ASC';
    else if (filters.sort === 'price-desc') sql += ' ORDER BY p.price DESC';
    else if (filters.sort === 'alpha-asc')  sql += ' ORDER BY p.name ASC';
    else sql += ' ORDER BY p.id ASC';

    const rows = await this.rawQuery(sql, values);
    return rows.map(r => this._toModel(r));
  }

  async findById(id) {
    const rows = await this.rawQuery(`
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);
    if (!rows.length) return null;
    return this._toModel(rows[0]);
  }

  async decrementStock(id, qty, conn) {
    await conn.execute(
      'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
      [qty, id, qty]
    );
  }
}

module.exports = ProductRepository;
