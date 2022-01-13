const DBConnection = require('../config/dbConnection');
const loginService = require('../services/loginService');

let getUserProfile = (req, res) => {
    if(req.session.loggedin) {
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

let getUserInfo = (req, res) => {
    if(req.session.loggedin) {
        req.breadcrumbs({
            name: 'Προφίλ',
            url: '/account'
        }, {
            name: 'Επεξεργασία προφίλ',
            url: '/account/edit'
        }
        )
        return res.render('users/edit', {
            user: req.session.currentUser
        })
    } else {
        req.flash('errors', 'Απαγορεύεται η πρόσβαση')
        res.redirect('/login')
    }
};

let updateUserInfo = async(req,res) => {
    if (req.session.loggedin) {
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
                DBConnection.query('UPDATE user SET first_name = ?, last_name = ?, phone = ?, email = ? WHERE id = ?', 
                                            [first_name, last_name, phone, email, req.session.currentUser.id],  
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



module.exports = {
    getUserProfile: getUserProfile,
    getUserInfo: getUserInfo,
    updateUserInfo: updateUserInfo
}