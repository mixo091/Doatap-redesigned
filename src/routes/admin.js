const express = require("express");
const router = express.Router()
const adminController = require('../controllers/adminController');
// const loginService = require('../services/loginService');
// const userController = require('../controllers/userController');

router.get('/', adminController.getAdminProfile)
router.get('/all-requests', adminController.getAllRequests)
router.get('/user-info', adminController.getAdminInfo)
router.get('/edit', adminController.getEditPage)

router.put('/edit', adminController.updateAdminInfo)


module.exports = router;