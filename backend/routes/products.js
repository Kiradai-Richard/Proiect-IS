const router = require('express').Router();
const ctrl   = require('../controllers/productController');
const Auth   = require('../middleware/auth');

router.get ('/',           ctrl.getAll);
router.get ('/categories', ctrl.getCategories);
router.get ('/:id',        ctrl.getById);
router.post('/',           Auth.authenticate, Auth.requireStaff, ctrl.create);
router.put ('/:id',        Auth.authenticate, Auth.requireStaff, ctrl.update);
router.delete('/:id',      Auth.authenticate, Auth.requireRole('manager'), ctrl.delete);

module.exports = router;
