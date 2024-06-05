const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middlewares/adminMiddleware')

router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);
router.get('/import', adminMiddleware, adminController.importDatabase )
router.get('/export', adminMiddleware, adminController.exportDatabase)

module.exports = router;