const router = require('express').Router();
const ctrl   = require('../controllers/employeeController');
const Auth   = require('../middleware/auth');

router.get   ('/',       Auth.authenticate, Auth.requireStaff, ctrl.getAll);
router.get   ('/stats',  Auth.authenticate, Auth.requireStaff, ctrl.getStats);
router.get   ('/:id',    Auth.authenticate, Auth.requireStaff, ctrl.getById);
router.put   ('/:id',    Auth.authenticate, Auth.requireRole('manager'), ctrl.update);
router.delete('/:id',    Auth.authenticate, Auth.requireRole('manager'), ctrl.deactivate);

module.exports = router;
