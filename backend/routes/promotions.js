const router = require('express').Router();
const ctrl   = require('../controllers/promotionController');
const Auth   = require('../middleware/auth');

router.get   ('/active', ctrl.getActive);
router.get   ('/',       Auth.authenticate, Auth.requireStaff, ctrl.getAll);
router.post  ('/',       Auth.authenticate, Auth.requireStaff, ctrl.create);
router.delete('/:id',    Auth.authenticate, Auth.requireStaff, ctrl.delete);

module.exports = router;
