const { pool } = require('../config/db');

class BaseRepository {
  constructor(tableName) {
    if (new.target === BaseRepository) throw new Error('BaseRepository este abstract');
    this.tableName = tableName;
    this.pool = pool;
  }

  async rawQuery(sql, params = []) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }

  async findById(id) {
    const rows = await this.rawQuery(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
    if (!rows.length) return null;
    return this._toModel(rows[0]);
  }

  async findAll(conditions = {}) {
    let sql = `SELECT * FROM ${this.tableName}`;
    const values = [];
    const entries = Object.entries(conditions);
    if (entries.length) {
      sql += ' WHERE ' + entries.map(([k]) => `${k} = ?`).join(' AND ');
      entries.forEach(([, v]) => values.push(v));
    }
    const rows = await this.rawQuery(sql, values);
    return rows.map(r => this._toModel(r));
  }

  async create(data) {
    const keys = Object.keys(data);
    const sql = `INSERT INTO ${this.tableName} (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`;
    const result = await this.rawQuery(sql, Object.values(data));
    return this.findById(result.insertId);
  }

  async update(id, data) {
    const keys = Object.keys(data);
    const sql = `UPDATE ${this.tableName} SET ${keys.map(k => `${k} = ?`).join(', ')} WHERE id = ?`;
    await this.rawQuery(sql, [...Object.values(data), id]);
    return this.findById(id);
  }

  async delete(id) {
    await this.rawQuery(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
  }

  async count(conditions = {}) {
    let sql = `SELECT COUNT(*) as cnt FROM ${this.tableName}`;
    const values = [];
    const entries = Object.entries(conditions);
    if (entries.length) {
      sql += ' WHERE ' + entries.map(([k]) => `${k} = ?`).join(' AND ');
      entries.forEach(([, v]) => values.push(v));
    }
    const rows = await this.rawQuery(sql, values);
    return rows[0].cnt;
  }

  _toModel(_row) {
    throw new Error('_toModel trebuie implementat de subclasa');
  }
}

module.exports = BaseRepository;
