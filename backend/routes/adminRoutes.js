// Admin routes: manage users, stats, reports
const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')

router.get('/users', adminController.getUsers)
router.get('/stats', adminController.getStats)
router.get('/reports', adminController.getReports)

module.exports = router
