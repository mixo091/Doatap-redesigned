const DBConnection = require('../config/dbConnection');
const loginService = require('../services/loginService');
const userService = require('../services/userService');

let getUserProfile = (req, res) => {
    if(req.session.loggedin && req.session.currentUser.isAdmin != 1) {
        req.breadcrumbs({
            name: 'Προφίλ',
            url: '/account'
        })
        return res.render('users/index', {
            user: req.session.currentUser
        })
    } else {
        req.flash('errors', 'Χρειάζεται να είστε συνδεδεμένοι για αυτήν την ενέργεια')
        res.redirect('/login')
    }
};

let getNewRequestPage = (req, res) => {
    if(req.session.loggedin && req.session.currentUser.isAdmin != 1 ) {
        req.breadcrumbs([{
            name: 'Προφίλ',
            url: '/account'
        }, {
            name: 'Νέα Αίτηση',
            url: '/account/request'
        }])
        return res.render('users/request', {
            user: req.session.currentUser
        })
    } else {
        req.flash('errors', 'Απαγορεύεται η πρόσβαση')
        res.redirect('/login')
    }
};

let getUserInfo = (req, res) => {
    if(req.session.loggedin && req.session.currentUser.isAdmin != 1 ) {
        req.breadcrumbs([{
            name: 'Προφίλ',
            url: '/account'
        }, {
            name: 'Επεξεργασία προφίλ',
            url: '/account/edit'
        }])
        return res.render('users/edit', {
            user: req.session.currentUser
        })
    } else {
        req.flash('errors', 'Απαγορεύεται η πρόσβαση')
        res.redirect('/login')
    }
};

let updateUserInfo = async(req,res) => {
    if (req.session.loggedin && req.session.currentUser.isAdmin != 1) {
        const {
            first_name,
            last_name,
            phone,
            email,
            password
        } = req.body

        try {
            let match = await loginService.comparePassword(password, req.session.currentUser);
            if(match == false ){
                req.flash('errors', 'Λάθος κωδικός')
                res.redirect('/account/edit')
            } else {
                DBConnection.query('UPDATE user SET first_name = ?, last_name = ?, phone = ?, email = ? WHERE user_id = ?', 
                                            [first_name, last_name, phone, email, req.session.currentUser.user_id],  
                (error, result) => {
                    if (error) {
                        console.log(error)
                        throw error
                    }
                    req.session.currentUser.first_name = first_name
                    req.session.currentUser.last_name = last_name
                    req.session.currentUser.phone = phone
                    req.session.currentUser.email = email
                    // req.session.currentUser.password = password
                    console.log('result => ', result)
                    req.flash('success', 'Ενημέρωση στοιχείων επιτυχής')
                    res.redirect('/account');
                })
            }
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    } else {
        req.flash('errors', 'Απαγορεύεται η πρόσβαση')
        res.redirect('/login')
    }
};

let createNewRequest = async(req,res) => {
    //validate required fields
    // let errorsArr = [];
    // let validationErrors = validationResult(req);
    // if (!validationErrors.isEmpty()) {
    //     let errors = Object.values(validationErrors.mapped());
    //     errors.forEach((item) => {
    //         errorsArr.push(item.msg);
    //     });
    //     req.flash("errors", errorsArr);
    //     return res.redirect("/register");
    // }
    //create a new request
    let newRequest = {
        user_id: req.session.currentUser.user_id,
        country: req.body.country,
        university: req.body.university,
        certificate: req.body.certificate,
        recognition: req.body.recognition
    };
    
    try {
        await userService.createNewRequest(newRequest);

        return res.redirect("/account");
    } catch (err) {
        req.flash("errors", err);
        return res.redirect("/login");
    }
};

let getAllRequests = async(req,res) => {    
    if (req.session.loggedin && req.session.currentUser.isAdmin != 1) {
        req.breadcrumbs([{
            name: 'Προφίλ',
            url: '/account'
        }, {
            name: 'Οι αιτήσεις μου',
            url: '/account/user-requests'
        }])
        
        try {
            let rows = await userService.getUserRequestsById(req.session.currentUser.user_id);

            const result = Object.values(JSON.parse(JSON.stringify(rows)));

            result.forEach(v => console.log(v.req_id)) 
            // console.log(result.stringify)
            return res.render('users/user-requests', 
            { 
                result, 
                user: req.session.currentUser 
            })
        } catch (err) {
            req.flash("errors", err);
            return res.redirect("/login");
        }
    }
};


module.exports = {
    getUserProfile: getUserProfile,
    getUserInfo: getUserInfo,
    updateUserInfo: updateUserInfo,
    getNewRequestPage: getNewRequestPage,
    createNewRequest: createNewRequest,
    getAllRequests: getAllRequests
}