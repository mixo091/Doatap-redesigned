const registerService = require('../services/registerService');
const {validationResult} = require('express-validator');

let getPageRegister = (req, res) => {
    req.breadcrumbs({
        name: 'Εγγραφή',
        url: '/register'
    })
    return res.render("register", {
        errors: req.flash("errors")
    });
};

let createNewUser = async(req,res) => {
     //validate required fields
     let errorsArr = [];
     let validationErrors = validationResult(req);
     if (!validationErrors.isEmpty()) {
         let errors = Object.values(validationErrors.mapped());
         errors.forEach((item) => {
             errorsArr.push(item.msg);
         });
         console.log(errorsArr)
         req.flash("errors", errorsArr);
         return res.redirect("/register");
     }
 
     //create a new user
     let newUser = {
         first_name: req.body.first_name,
         last_name: req.body.last_name,
         phone: req.body.phone,
         email: req.body.email,
         password: req.body.password
     };
     try {
         let message = await registerService.createNewUser(newUser);
         console.log(message)
         req.flash('success', 'Ο λογαριασμός σας δημιουργήθηκε επιτυχώς!')
         return res.redirect("/login");
     } catch (err) {
         console.log(err)
         req.flash("errors", err);
         return res.redirect("/register");
     }
};

module.exports = {
    getPageRegister: getPageRegister,
    createNewUser: createNewUser
};
