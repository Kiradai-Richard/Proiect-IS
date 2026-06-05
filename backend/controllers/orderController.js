const OrderService = require('../services/OrderService');

exports.createPurchase = async (req, res) => {
  try {
    const order = await OrderService.createPurchase(req.user.id, req.body.items, req.user);
    res.status(201).json(order.toJSON());
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.createService = async (req, res) => {
  try {
    const order = await OrderService.createService(req.user.id, req.body);
    res.status(201).json(order.toJSON());
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.getAll = async (req, res) => {
  try {
    const orders = await OrderService.getAll(req.user, req.user.id, req.query.type || null);
    res.json(orders.map(o => o.toJSON()));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getStats = async (req, res) => {
  try { res.json(await OrderService.getStats(req.user)); }
  catch (e) { res.status(403).json({ error: e.message }); }
};

exports.getById = async (req, res) => {
  try {
    const order = await OrderService.getById(req.params.id, req.user, req.user.id);
    res.json(order.toJSON());
  } catch (e) { res.status(404).json({ error: e.message }); }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, handled_by } = req.body;
    const order = await OrderService.updateStatus(req.params.id, status, handled_by, req.user);
    res.json(order.toJSON());
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.delete = async (req, res) => {
  try {
    await OrderService.delete(req.params.id, req.user);
    res.json({ message: 'Comanda stearsa' });
  } catch (e) { res.status(400).json({ error: e.message }); }
};
