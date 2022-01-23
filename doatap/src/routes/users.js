const express = require("express");
const router = express.Router()
const DBConnection = require('../config/dbConnection'); 
const loginService = require('../services/loginService');
const userController = require('../controllers/userController');

router.get('/', userController.getUserMenu)
router.get('/user-info', userController.getUserProfile)
router.get('/edit', userController.getUserInfo)
router.get('/request', userController.getNewRequestPage)
router.get('/user-requests', userController.getAllRequests)

router.post('/request', userController.createNewRequest)

router.put('/edit', userController.updateUserInfo)

module.exports = router;