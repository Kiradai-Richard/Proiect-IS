const router = require('express').Router();
const ctrl   = require('../controllers/orderController');
const Auth   = require('../middleware/auth');

router.get   ('/',          Auth.authenticate, ctrl.getAll);
router.get   ('/stats',     Auth.authenticate, Auth.requireStaff, ctrl.getStats);
router.post  ('/purchase',  Auth.authenticate, ctrl.createPurchase);
router.post  ('/service',   Auth.authenticate, ctrl.createService);
router.get   ('/:id',       Auth.authenticate, ctrl.getById);
router.put   ('/:id/status',Auth.authenticate, Auth.requireStaff, ctrl.updateStatus);
router.delete('/:id',       Auth.authenticate, Auth.requireRole('manager'), ctrl.delete);

module.exports = router;
