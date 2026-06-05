const AuthService = require('../services/AuthService');

exports.register = async (req, res) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.registerEmployee = async (req, res) => {
  try {
    const result = await AuthService.registerEmployee(req.body, req.user);
    res.status(201).json(result);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (e) { res.status(401).json({ error: e.message }); }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await AuthService.getProfile(req.user.id);
    res.json(profile);
  } catch (e) { res.status(404).json({ error: e.message }); }
};
