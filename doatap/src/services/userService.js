const DBConnection = require('../config/dbConnection');

let createNewRequest = (data) => {
    return new Promise(async (resolve, reject) => {
        
        let reqItem = {
            user_id: data.user_id,
            country: data.country,
            university: data.university,
            department: data.department,
            title: data.title,
            ects: data.ects,
            study_duration: data.duration,
            parabola_file: data.parabola_file,
            id_file: data.id_file,
            diploma_file: data.diploma_file
        };

        console.log(reqItem)

        //create a new request
        DBConnection.query(
            ' INSERT INTO requests set ? ', reqItem,
            function(err, rows) {
                if (err) {
                    console.log(err)
                    reject(false)
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

let uploadFiles = (data, id) => {
    return new Promise(async (resolve, reject) => {

        console.log(data)
        //create a new request
        DBConnection.query(
            ' UPDATE requests SET id_file = ? WHERE user_id = ? ORDER BY user_id ', [data.name, id],
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


let tempSave = (data) => {
    return new Promise(async (resolve, reject) => {

        console.log(data)
        DBConnection.query('SELECT * FROM requests WHERE user_id = ?', data.user_id, 
        function(err, rows) {
            if (err) {
                console.log(err)
                reject(false)
            }
            console.log(rows)
            if(rows[0] > 0) {
                DBConnection.query(
                    ' UPDATE requests set country = ?, university = ?, department = ?, title = ?, ects = ?, study_duration = ?', 
                    [ data.country, data.university, data.department, data.title, data.ects, data.duration],
                    function(err, rows) {
                        if (err) {
                            console.log(err)
                            reject(false)
                        }
                        console.log(rows)
                        resolve(rows)
                        // resolve("Create a new request successful");
                    }
            )} else {
                DBConnection.query(
                    ' INSERT INTO requests set ?', data, function(err, rows) {
                        if (err) {
                            console.log(err)
                            reject(false)
                        }
                        console.log(rows)
                        resolve(rows)
                        // resolve("Create a new request successful");
                    }
            )
            }
        }
        );
    });
};


module.exports = {
    createNewRequest: createNewRequest,
    getUserRequestsById: getUserRequestsById,
    getAllUsersRequests: getAllUsersRequests,
    uploadFiles: uploadFiles,
    tempSave: tempSave
};