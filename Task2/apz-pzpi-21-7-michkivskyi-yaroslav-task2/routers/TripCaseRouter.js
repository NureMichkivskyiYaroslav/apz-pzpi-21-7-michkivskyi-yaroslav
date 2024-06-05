const express = require('express');
const router = express.Router();
const tripCaseController = require('../controllers/TripCaseController');
const adminMiddleware = require('../middlewares/adminMiddleware');
const clientMiddleware  = require('../middlewares/clientMiddleware');

router.post('/add', adminMiddleware, tripCaseController.addTripCase);
router.get('/client/:id', clientMiddleware, tripCaseController.getTripCaseClient);
router.post('/ti/add', tripCaseController.addTemperatureIndicator);
router.get('/:id', adminMiddleware, tripCaseController.getTripCase);

module.exports = router;