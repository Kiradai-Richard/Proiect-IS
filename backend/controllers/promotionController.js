const PromotionService = require('../services/PromotionService');

exports.getActive = async (req, res) => {
  try { res.json(await PromotionService.getActive()); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getAll = async (req, res) => {
  try { res.json(await PromotionService.getAll(req.user)); }
  catch (e) { res.status(403).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try { res.status(201).json(await PromotionService.create(req.body, req.user)); }
  catch (e) { res.status(400).json({ error: e.message }); }
};

exports.delete = async (req, res) => {
  try {
    await PromotionService.delete(req.params.id, req.user);
    res.json({ message: 'Promotie stearsa' });
  } catch (e) { res.status(400).json({ error: e.message }); }
};
