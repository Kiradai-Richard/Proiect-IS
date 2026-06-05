const router = require('express').Router();
const ctrl   = require('../controllers/authController');
const Auth   = require('../middleware/auth');

router.post('/register',          ctrl.register);
router.post('/register-employee', Auth.authenticate, Auth.requireRole('manager'), ctrl.registerEmployee);
router.post('/login',             ctrl.login);
router.get ('/profile',           Auth.authenticate, ctrl.getProfile);

module.exports = router;
