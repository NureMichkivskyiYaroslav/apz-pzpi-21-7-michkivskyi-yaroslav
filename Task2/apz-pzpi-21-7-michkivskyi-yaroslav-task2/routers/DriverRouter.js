const express = require('express');
const router = express.Router();
const driverController = require('../controllers/DriverController');
const adminMiddleware = require('../middlewares/AdminMiddleware');

router.get('/all', adminMiddleware, driverController.getAllDrivers);
router.post('/add',adminMiddleware, driverController.addDriver);
router.get('/:id', adminMiddleware, driverController.getDriver);
router.patch('/:id/edit', adminMiddleware, driverController.editDriver);
router.delete('/:id/delete', adminMiddleware, driverController.deleteDriver)

module.exports = router;