const BaseRepository = require('./BaseRepository');
const { Order } = require('../models/Order');

class OrderRepository extends BaseRepository {
  constructor() { super('orders'); }

  _toModel(row) { return Order.create(row); }

  async findWithItems(id) {
    const rows = await this.rawQuery('SELECT * FROM orders WHERE id = ?', [id]);
    if (!rows.length) return null;
    const items = await this.rawQuery('SELECT * FROM order_items WHERE order_id = ?', [id]);
    const order = this._toModel(rows[0]);
    order.items = items;
    return order;
  }

  async findAllWithItems(conditions = {}) {
    let sql = 'SELECT * FROM orders';
    const values = [];
    const entries = Object.entries(conditions);
    if (entries.length) {
      sql += ' WHERE ' + entries.map(([k]) => `${k} = ?`).join(' AND ');
      entries.forEach(([, v]) => values.push(v));
    }
    sql += ' ORDER BY created_at DESC';
    const orders = await this.rawQuery(sql, values);
    return Promise.all(
      orders.map(async o => {
        const items = await this.rawQuery('SELECT * FROM order_items WHERE order_id = ?', [o.id]);
        const order = this._toModel(o);
        order.items = items;
        return order;
      })
    );
  }

  async createWithItems(orderData, items, conn) {
    const keys = Object.keys(orderData);
    const sql = `INSERT INTO orders (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`;
    const [result] = await conn.execute(sql, Object.values(orderData));
    const orderId = result.insertId;

    for (const item of items) {
      await conn.execute(
        'INSERT INTO order_items (order_id, product_id, item_name, quantity, price, is_promo_discount) VALUES (?,?,?,?,?,?)',
        [orderId, item.product_id || null, item.item_name || null, item.quantity, item.price, item.is_promo_discount ? 1 : 0]
      );
    }

    return orderId;
  }
}

module.exports = OrderRepository;
