const express = require('express');
const router = express.Router();
const fridgeController = require('../controllers/FridgeController');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.post('/add', adminMiddleware, fridgeController.addFridge);
router.patch('/:id/edit', adminMiddleware, fridgeController.editFridge);
router.patch('/:id/relocate', fridgeController.relocateFridge)
router.delete('/:id/delete', adminMiddleware, fridgeController.deleteFridge);
router.get('/:id/get', adminMiddleware, fridgeController.getFridge);
router.get('/:id/nearest', adminMiddleware, fridgeController.getNearestFridge);
router.get('/all', adminMiddleware, fridgeController.getAllFridges)

module.exports = router