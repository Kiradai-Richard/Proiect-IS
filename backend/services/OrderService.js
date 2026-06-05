const OrderRepository  = require('../repositories/OrderRepository');
const ProductRepository = require('../repositories/ProductRepository');
const { pool } = require('../config/db');

const orderRepo   = new OrderRepository();
const productRepo = new ProductRepository();

class OrderService {
  async createPurchase(userId, items, user) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      let total = 0;
      const processedItems = [];

      for (const item of items) {
        if (item.is_promo_discount) {
          processedItems.push({
            product_id: null,
            item_name: item.item_name,
            quantity: 1,
            price: item.price,
            is_promo_discount: 1,
          });
          total += Number(item.price);
        } else {
          const product = await productRepo.findById(item.product_id);
          if (!product) throw new Error(`Produs ${item.product_id} negasit`);
          if (product.stock < item.quantity) throw new Error(`Stoc insuficient: ${product.name}`);

          await productRepo.decrementStock(item.product_id, item.quantity, conn);

          processedItems.push({
            product_id: item.product_id,
            item_name: product.name,
            quantity: item.quantity,
            price: product.price,
            is_promo_discount: 0,
          });
          total += product.price * item.quantity;
        }
      }

      const [uRows] = await conn.execute('SELECT * FROM users WHERE id = ?', [userId]);
      const u = uRows[0];

      const orderId = await orderRepo.createWithItems({
        user_id: userId,
        order_type: 'purchase',
        customer_name: u.name,
        customer_email: u.email,
        customer_phone: u.phone || '',
        customer_address: u.address || '',
        total: total.toFixed(2),
        status: 'pending',
      }, processedItems, conn);

      await conn.commit();
      return orderRepo.findWithItems(orderId);
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  }

  async createService(userId, data) {
    const [uRows] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
    const u = uRows[0];

    const result = await orderRepo.rawQuery(
      `INSERT INTO orders
         (user_id, order_type, customer_name, customer_email, customer_phone, customer_address, total, status, service_description, service_date)
       VALUES (?, 'service', ?, ?, ?, ?, 0, 'pending', ?, ?)`,
      [
        userId,
        data.customer_name  || u.name,
        data.customer_email || u.email,
        data.customer_phone || u.phone || '',
        u.address || '',
        data.service_description,
        data.service_date,
      ]
    );
    return orderRepo.findWithItems(result.insertId);
  }

  async getAll(user, userId = null, type = null) {
    const conditions = {};
    if (!user.canHandleOrders()) conditions.user_id = userId;
    if (type) conditions.order_type = type;
    return orderRepo.findAllWithItems(conditions);
  }

  async getById(id, user, userId) {
    const order = await orderRepo.findWithItems(id);
    if (!order) throw new Error('Comanda negasita');
    if (!user.canHandleOrders() && order.userId !== userId) throw new Error('Acces interzis');
    return order;
  }

  async updateStatus(id, status, handledBy, user) {
    if (!user.canHandleOrders()) throw new Error('Acces interzis');
    await orderRepo.update(id, {
      status,
      ...(handledBy !== undefined ? { handled_by: handledBy || null } : {}),
    });
    return orderRepo.findWithItems(id);
  }

  async delete(id, user) {
    if (!user.canManageEmployees()) throw new Error('Acces interzis');
    await orderRepo.delete(id);
  }

  async getStats(user) {
    if (!user.canHandleOrders()) throw new Error('Acces interzis');
    const rows = await orderRepo.rawQuery(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status='pending'    THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status='processing' THEN 1 ELSE 0 END) AS processing,
        SUM(CASE WHEN status='delivered'  THEN 1 ELSE 0 END) AS delivered,
        COALESCE(SUM(CASE WHEN order_type='purchase' THEN total ELSE 0 END), 0) AS revenue
      FROM orders
    `);
    return rows[0];
  }
}

module.exports = new OrderService();
