const { validationResult } = require("express-validator");
const loginService = require('../services/loginService');

let getPageLogin = (req, res) => {
    req.breadcrumbs({
        name: 'Σύνδεση',
        url: '/login'
    })
    return res.render('login', {
        errors: req.flash("errors")
    });
};

let handleLogin = async(req,res) => {
    let errorsArr = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.forEach((item) => {
            errorsArr.push(item.msg);
        });
        // console.log(errorsArr)
        req.flash("errors", errorsArr);
        return res.redirect("/login");
    }
    try {
        await loginService.handleLogin(req.body.email, req.body.password);
        return res.redirect("/")
    } catch (err) {
        console.log(err)
        req.flash("errors", err);
        return res.redirect("/login");
    }
};

let createLogin = async(req, res) => {
    const {
        email,
        password,
        isAdmin
    } = req.body;

    let errorsArr = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.forEach((item) => {
            errorsArr.push(item.msg);
        });
        console.log(errorsArr)
        req.flash("errors", errorsArr);
        return res.redirect("/login");
    }

    try {
        await loginService.findUserByEmail(email).then(async (user) => {
            if(user) {
                let match = await loginService.comparePassword(password, user);
                if(match == true) {
                    req.session.loggedin = true;
                     // let's check if an admin
                     req.session.currentUser = user
                     console.log("req.session.currentUser => ", req.session.currentUser)
                     // response.redirect('/account')
                     if (user.isAdmin == 1) {
                         return res.redirect('/admin')
                     } else {
                         res.redirect('/account')
                     }
                } else {
                    req.session.message = {
                        type: 'danger',
                        intro: 'Τα στοιχεία που καταχωρήσατε είναι λανθασμένα',
                        message: 'Παρακαλώ ξαναπροσπαθήστε'
                    }
                    // req.flash('errors', "Τα στοιχεία που καταχωρήσατε είναι λανθασμένα")
                    res.redirect("/login")
                }
            } else {
                // req.flash('errors', "Τα στοιχεία που καταχωρήσατε είναι λανθασμένα")
                res.redirect("/login")
            }
        })
    } catch (err) {
        console.log(err)
        res.send(err)
    }
};

let checkLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    next();
};

let checkLoggedOut = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
};

let postLogOut = (req, res) => {
    delete req.session.currentUser
    delete res.locals.currentUser
    req.session.loggedin = false
    req.flash('success', 'Αποσύνδεση επιτυχής')
    res.redirect("/")
};

module.exports = {
    getPageLogin: getPageLogin,
    handleLogin: handleLogin,
    createLogin: createLogin,
    checkLoggedIn: checkLoggedIn,
    checkLoggedOut: checkLoggedOut,
    postLogOut: postLogOut
};