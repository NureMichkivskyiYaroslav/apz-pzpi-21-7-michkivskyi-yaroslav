const express = require('express');
const router = express.Router();
const clientController = require('../controllers/ClientController');
const adminMiddleware = require('../middlewares/adminMiddleware');
const clientMiddleware = require('../middlewares/clientMiddleware');

router.post('/register', clientController.registerClient);
router.get('/login', clientController.loginClient);
router.get('/trips', clientMiddleware, clientController.getClientTrips);
router.get('/:id', adminMiddleware, clientController.getClientById);

module.exports = router;