// const DBConnection = require('../config/dbConnection');
// const loginService = require('../services/loginService');
const userService = require('../services/userService');


let getAdminProfile = (req, res) => {
    if(req.session.loggedin && req.session.currentUser.isAdmin == 1) {
        req.breadcrumbs({
            name: 'Προφίλ',
            url: '/admin'
        })
        return res.render('users/admin', {
            user: req.session.currentUser
        })
    } else {
        req.flash('errors', 'Χρειάζεται να είστε συνδεδεμένοι για αυτήν την ενέργεια')
        res.redirect('/login')
    }
};

let getAllRequests = async(req, res) => {
    if(req.session.loggedin && req.session.currentUser.isAdmin == 1) {
        req.breadcrumbs([{
            name: 'Προφίλ',
            url: '/admin'
        }, {
            name: 'Αιτήσεις',
            url: '/all-requests'
        }])

        try {
            let rows = await userService.getAllUsersRequests(req.session.currentUser.user_id)

            const result = Object.values(JSON.parse(JSON.stringify(rows)));

            return res.render('users/admin', 
            { 
                result, 
                user: req.session.currentUser 
            })
        } catch(err) {
            console.log(err)
            return res.redirect("/login");
        }
    } else {
        // req.flash('errors')
        res.redirect('/login')
    }
};


// let getUserInfo = (req, res) => {
//     if(req.session.loggedin) {
//         req.breadcrumbs([{
//             name: 'Προφίλ',
//             url: '/account'
//         }, {
//             name: 'Επεξεργασία προφίλ',
//             url: '/account/edit'
//         }])
//         return res.render('users/edit', {
//             user: req.session.currentUser
//         })
//     } else {
//         req.flash('errors', 'Απαγορεύεται η πρόσβαση')
//         res.redirect('/login')
//     }
// };

// let updateUserInfo = async(req,res) => {
//     if (req.session.loggedin) {
//         const {
//             first_name,
//             last_name,
//             phone,
//             email,
//             password
//         } = req.body

//         try {
//             let match = await loginService.comparePassword(password, req.session.currentUser);
//             if(match == false ){
//                 req.flash('errors', 'Λάθος κωδικός')
//                 res.redirect('/account/edit')
//             } else {
//                 DBConnection.query('UPDATE user SET first_name = ?, last_name = ?, phone = ?, email = ? WHERE user_id = ?', 
//                                             [first_name, last_name, phone, email, req.session.currentUser.user_id],  
//                 (error, result) => {
//                     if (error) {
//                         console.log(error)
//                         throw error
//                     }
//                     req.session.currentUser.first_name = first_name
//                     req.session.currentUser.last_name = last_name
//                     req.session.currentUser.phone = phone
//                     req.session.currentUser.email = email
//                     // req.session.currentUser.password = password
//                     console.log('result => ', result)
//                     req.flash('success', 'Ενημέρωση στοιχείων επιτυχής')
//                     res.redirect('/account');
//                 })
//             }
//         } catch (err) {
//             console.log(err);
//             res.send(err);
//         }
//     } else {
//         req.flash('errors', 'Απαγορεύεται η πρόσβαση')
//         res.redirect('/login')
//     }
// };

module.exports = {
    getAdminProfile: getAdminProfile,
    getAllRequests: getAllRequests
}