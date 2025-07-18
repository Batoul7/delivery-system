const router = require('express').Router();
const controller = require('./rating.controller');
const auth = require('../../middlewares/auth');

router.post('/', auth('client'), controller.create);
router.get('/driver/:driverId', controller.getByDriver);
router.get('/order/:orderId', controller.getByOrder);
router.delete('/:id', auth('admin'), controller.delete);

module.exports = router;