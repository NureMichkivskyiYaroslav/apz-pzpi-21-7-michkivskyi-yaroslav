const express = require('express');
const router = express.Router();
const caseController = require('../controllers/CaseController');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.post('/add', adminMiddleware, caseController.addCase);
router.patch('/:id/edit', adminMiddleware, caseController.editCase);
router.delete('/:id/delete', adminMiddleware, caseController.deleteCase);
router.get('/:id', adminMiddleware, caseController.getCase);
router.get('/all', adminMiddleware, caseController.getAllCases)

module.exports = router;