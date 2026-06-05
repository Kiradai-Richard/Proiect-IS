const EmployeeService = require('../services/EmployeeService');

exports.getAll = async (req, res) => {
  try { res.json(await EmployeeService.getAll(req.user)); }
  catch (e) { res.status(403).json({ error: e.message }); }
};

exports.getStats = async (req, res) => {
  try { res.json(await EmployeeService.getStats(req.user)); }
  catch (e) { res.status(403).json({ error: e.message }); }
};

exports.getById = async (req, res) => {
  try { res.json(await EmployeeService.getById(req.params.id, req.user)); }
  catch (e) { res.status(404).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  try { res.json(await EmployeeService.update(req.params.id, req.body, req.user)); }
  catch (e) { res.status(400).json({ error: e.message }); }
};

exports.deactivate = async (req, res) => {
  try {
    await EmployeeService.deactivate(req.params.id, req.user);
    res.json({ message: 'Angajat dezactivat' });
  } catch (e) { res.status(400).json({ error: e.message }); }
};
