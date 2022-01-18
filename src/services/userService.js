const DBConnection = require('../config/dbConnection');

let createNewRequest = (data) => {
    return new Promise(async (resolve, reject) => {
        
        let reqItem = {
            user_id: data.user_id,
            country: data.country,
            university: data.university,
            certificate: data.certificate,
            recognition: data.recognition
        };

        console.log(reqItem)

        //create a new request
        DBConnection.query(
            ' INSERT INTO requests set ? ', reqItem,
            function(err, rows) {
                if (err) {
                    reject(false)
                    console.log("Error")

                }
                console.log("ok")
                resolve("Create a new request successful");
                console.log(rows)
            }
        );   
    });
};

let getUserRequestsById = (id) => {
    return new Promise(async (resolve, reject) => {

        console.log('user_id = ', id)

        //create a new request
        DBConnection.query(
            ' SELECT * FROM requests where user_id = ? ', id,
            function(err, rows) {
                if (err) {
                    reject(false)
                }
                // console.log(rows)
                resolve(rows)
                // resolve("Create a new request successful");
                
            }
        );   
    });
};

let getAllUsersRequests = (id) => {
    return new Promise(async (resolve, reject) => {

        console.log('admin_id = ', id)

        //create a new request
        DBConnection.query(
            ' SELECT * FROM requests where user_id != ? ORDER BY user_id ', id,
            function(err, rows) {
                if (err) {
                    reject(false)
                }
                // console.log(rows)
                resolve(rows)
                // resolve("Create a new request successful");
            }
        );   
    });
};


module.exports = {
    createNewRequest: createNewRequest,
    getUserRequestsById: getUserRequestsById,
    getAllUsersRequests: getAllUsersRequests
};