const DBConnection = require('../config/dbConnection');
const loginService = require('../services/loginService');
const userService = require('../services/userService');

let getUserMenu = (req, res) => {
    if(req.session.loggedin && req.session.currentUser.isAdmin != 1) {
        req.breadcrumbs({
            name: 'Μενού',
            url: '/user-menu'
        })
        return res.render('users/index', {
            user: req.session.currentUser
        })
    } else {
        req.flash('errors', 'Χρειάζεται να είστε συνδεδεμένοι για αυτήν την ενέργεια')
        res.redirect('/login')
    }
};

let getUserProfile = (req, res) => {
    if(req.session.loggedin && req.session.currentUser.isAdmin != 1) {
        req.breadcrumbs([{
            name: 'Μενού',
            url: '/user-menu'
        } , {
            name: 'Πληροφορίες Χρήστη',
            url: '/user-menu/user-info' 
        }])
        return res.render('users/user-info', {
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
            name: 'Μενού',
            url: '/user-menu'
        }, {
            name: 'Νέα Αίτηση',
            url: '/user-menu/request'
        }])
        let newRequest = {
            user_id: req.session.currentUser.user_id,
            country: '',
            university: '',
            department: '',
            title: '',
            ects: '',
            duration: '',
            parabola_file: '',
            id_file: '',
            diploma_file: ''
        };


        return res.render('users/request', {
            user: req.session.currentUser,
            newRequest
        })
    } else {
        req.flash('errors', 'Απαγορεύεται η πρόσβαση')
        res.redirect('/login')
    }
};

let getUserInfo = (req, res) => {
    if(req.session.loggedin && req.session.currentUser.isAdmin != 1 ) {
        req.breadcrumbs([{
            name: 'Μενού',
            url: '/user-menu'
        }, {
            name: 'Επεξεργασία προφίλ',
            url: '/user-menu/edit'
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
                res.redirect('/user-menu/edit')
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
                    res.redirect('/user-menu');
                })
            }
        } catch (err) {
            console.log(err);
            req.flash('errors', 'Ο κωδικός που πληκτρολογήσατε είναι λανθασμένος')
            res.redirect('/user-menu/edit')
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
        department: req.body.department,
        title: req.body.title,
        ects: req.body.ects,
        duration: req.body.duration,
        parabola_file: req.body.parabolo,
        id_file: req.body.id,
        diploma_file: req.body.diploma
    };

    if(newRequest.user_id === '' || newRequest.country === '' || newRequest.university === '' || 
        newRequest.department === '' || newRequest.title === '' || newRequest.ects === '' || newRequest.duration === '' ||
        newRequest.parabola_file=== '' || newRequest.id_file === '' || newRequest.diploma_file === '' ) {
            req.flash('errors', 'Δεν έχεις ολοκληρώσει την συμπλήρωση των πεδίων ή δεν έχεις ανεβάσει όσα αρχεία χρειάζεται. Ξαναπροσπάθησε')
            req.flash('msg',  'Η αίτησή σου αποθηκεύτηκε προσωρινά')
            // return res.redirect('/user-menu/request')
            return res.render('users/request', { newRequest})
            // return res.json(newRequest)
            // return res.json({"status": 200, "message": "POST recieved"});
        }
        
    try {
        await userService.createNewRequest(newRequest);

        return res.redirect("/user-menu/user-requests");        
    } catch (err) {
        req.flash("errors", err);
        // return res.redirect("/login");
    }
};

let getAllRequests = async(req,res) => {    
    if (req.session.loggedin && req.session.currentUser.isAdmin != 1) {
        req.breadcrumbs([{
            name: 'Μενού',
            url: '/user-menu'
        }, {
            name: 'Οι αιτήσεις μου',
            url: '/user-menu/user-requests'
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

let uploadFiles = async (req, res) => {
    if (req.session.loggedin && req.session.currentUser.isAdmin != 1) {
        let sampleFile;

        if(!req.files || Object.keys(req.files).length() === 0) {
            return res.status(400).send('No files were uploaded.')
        }
        sampleFile = req.files.sampleFile;
        
        try {
            await userService.uploadFiles(sampleFile)
        } catch (err) {
            console.log(err)
            req.flash("errors", err);
        }
    }
};



module.exports = {
    getUserMenu: getUserMenu,
    getUserProfile: getUserProfile,
    getUserInfo: getUserInfo,
    updateUserInfo: updateUserInfo,
    getNewRequestPage: getNewRequestPage,
    createNewRequest: createNewRequest,
    getAllRequests: getAllRequests,
    uploadFiles: uploadFiles
}