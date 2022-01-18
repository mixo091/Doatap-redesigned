const express = require("express");
const router = express.Router()
const adminController = require('../controllers/adminController');
// const loginService = require('../services/loginService');
// const userController = require('../controllers/userController');

router.get('/', adminController.getAdminProfile)

module.exports = router;