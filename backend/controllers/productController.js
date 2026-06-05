const ProductService = require('../services/ProductService');

exports.getAll = async (req, res) => {
  try {
    const products = await ProductService.getAll(req.query);
    res.json(products.map(p => p.toJSON()));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getCategories = async (req, res) => {
  try {
    res.json(await ProductService.getCategories());
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getById = async (req, res) => {
  try {
    const product = await ProductService.getById(req.params.id);
    res.json(product.toJSON());
  } catch (e) { res.status(404).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const product = await ProductService.create(req.body, req.user);
    res.status(201).json(product.toJSON());
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const product = await ProductService.update(req.params.id, req.body, req.user);
    res.json(product.toJSON());
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.delete = async (req, res) => {
  try {
    await ProductService.delete(req.params.id, req.user);
    res.json({ message: 'Produs sters' });
  } catch (e) { res.status(400).json({ error: e.message }); }
};
