const express = require('express');
const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginController');
const auth = require('../validation/authValidation');
// const initPassportLocal = require('../controllers/passportLocalController');

let router = express.Router();

// Init all passport
// initPassportLocal();

router.get('/', (req,res) => {
    if(!req.session.loggedin) {
        req.session.loggedin = false;
    }
    res.render('index');
});

router.get("/login", loginController.checkLoggedOut, loginController.getPageLogin);
router.get("/register", registerController.getPageRegister);
router.get("/logout", loginController.postLogOut)

router.post("/register", auth.validateRegister, registerController.createNewUser);
router.post("/login", auth.validateLogin, loginController.createLogin);

module.exports = router;