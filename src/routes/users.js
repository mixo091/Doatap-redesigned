const express = require("express");
const router = express.Router()
const DBConnection = require('../config/dbConnection'); 
const loginService = require('../services/loginService');
const userController = require('../controllers/userController');

router.get('/', userController.getUserProfile)
router.get('/edit', userController.getUserInfo)
router.get('/nea_aitisi', userController.getNewRequestPage)

router.put('/edit', userController.updateUserInfo)

module.exports = router;