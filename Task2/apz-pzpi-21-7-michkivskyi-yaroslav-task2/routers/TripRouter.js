const express = require('express');
const router = express.Router();
const tripController = require('../controllers/TripController');
const adminMiddleware = require('../middlewares/adminMiddleware');
const clientMiddleware  = require('../middlewares/clientMiddleware');

router.post('/add', adminMiddleware, tripController.addTrip);
router.get('/:id', adminMiddleware, tripController.getTrip);
router.get('/client/:id', clientMiddleware, tripController.getTripClient);
router.get('/resources', adminMiddleware, tripController.getResourses);
router.patch('/:id/finish', adminMiddleware, tripController.finishTrip)

module.exports = router;