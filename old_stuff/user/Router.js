// // our api end point
// const fs = require('fs');
// let crypto = require('crypto');
// const bcrypt = require('bcrypt');
// let aesjs = require('aes-js');
// let pbkdf2 = require('pbkdf2');
// const cors = require('cors');
// const utils = require('./utils');
// const jwt = require('jsonwebtoken');
// let moment = require('moment'); // require
//
// const mysql = require('mysql-promise');
//
// try {
//     crypto = require('crypto');
//     console.log("crypto loaded successfully")
// } catch (err) {
//     console.log('crypto support is disabled!');
// }
//
// // todo - process new inserted data
// function processData(data) {
//     // create a name: node map
//     let dataMap = data.reduce(function (map, node) {
//         map[node.SIC] = node;
//
//         return map;
//     }, {});
//
//     // create the tree array
//     let tree = [];
//     data.forEach(function (node) {
//         // add to parent
//         let parent = dataMap[node.ParentSIC];
//
//         if (parent) {
//             let SICkey = node.SIC;
//             delete node.SIC;
//             delete node.ID;
//             delete node.ParentSIC;
//             delete node.Level;
//             let object = {[SICkey]: node};
//
//             // create child array if it doesn't exist
//             (parent.children || (parent.children = []))
//                 // add node to child array
//                 .push(object);
//         } else {
//             // parent is null or missing
//             tree.push(node);
//         }
//     });
//     return tree;
// }
//
// class router {
//     constructor(app, db) {
//         // this is our routes that we have in our front end
//         this.index(app);
//         this.login(app, db);
//         this.logout(app);
//         this.signup(app, db);
//         this.submitStudyData(app, db);
//         this.getStudyData(app, db);
//         this.getStudyGroups(app, db);
//         this.getCategories(app, db);
//         this.getQuickLinks(app, db)
//     }
//
//     index(app) {
//         app.get('/', (req, res) => {
//             res.send(
//                 '<div style="align-content: center; align-items: center; text-align: center">' +
//                 '<hr/>' +
//                 '<h1 style="text-align: center; color: Red">Naughty Naughty, you should not be here!</h1>' +
//                 '<hr/>' +
//                 '<img src="https://i.pinimg.com/originals/c1/bb/af/c1bbaf1dd4705bd3dd448f20d2ba056e.gif" alt="">' +
//                 '<h1  style="text-align: center; color: black">Server is up :) </h1>' +
//                 '</div>'
//             )
//         });
//
//         app.post('/', (req, res) => {
//             res.send({message: "Server is up"})
//         });
//     }
//
//     login(app, db) {
//         let userData = {};
//         // validate the user credentials
//         app.post('/login', function (req, res) {
//             const user = req.body.username;
//             const password = req.body.password;
//             let cols = [user];
//             let getLogin = 'SELECT * FROM Users WHERE eMail = ? LIMIT 1';
//             db.query(getLogin, cols, (error, data, fields) => {
//                 if (error) {
//                     return res.status(400).json({
//                         error: true,
//                         message: "Username or Password required."
//                     });
//
//                 }
//
//                 if (data && data.length === 1) {
//
//                     // checking if the right password provided by user
//                     bcrypt.compare(password, data[0].Password, (bcryptErr, verified) => {
//                         if (verified) {
//                             userData = {
//                                 userId: data[0].ID,
//                                 name: data[0].eMail,
//                                 username: data[0].eMail,
//                                 studyKey: data[0].StudyKey,
//                                 salt: data[0].Salt,
//                                 iv: data[0].IV,
//                                 isAdmin: true
//                             }
//                             // generate token
//                             const token = utils.generateToken(userData);
//                             // get basic user details
//                             const userObj = utils.getCleanUser(userData);
//                             // return the token along with user details
//                             return res.json({user: userObj, token});
//                         } else {
//                             return res.status(401).json({
//                                 error: true,
//                                 message: "Invalid password, please try again!"
//                             });
//                         }
//                     });
//                 } else {
//                     // msg: 'User not found, please try again'
//                     return res.status(401).json({
//                         error: true,
//                         message: "Invalid password, please try again!"
//                     });
//                 }
//             });
//         });
//
//
//         // verify the token and return it if it's valid
//         app.get('/verifyToken', function (req, res) {
//             // check header or url parameters or post parameters for token
//             let token = req.body.token || req.query.token;
//             if (!token) {
//                 return res.status(400).json({
//                     error: true,
//                     message: "Token is required."
//                 });
//             }
//             // check token that was passed by decoding token using secret
//             jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
//                 if (err) return res.status(401).json({
//                     error: true,
//                     message: "Invalid token."
//                 });
//
//                 // return 401 status if the userId does not match.
//                 if (user.userId !== userData.userId) {
//                     return res.status(401).json({
//                         error: true,
//                         message: "Invalid user."
//                     });
//                 }
//                 // We return
//                 return res.json({tokenValid: true});
//             });
//         });
//     }
//
//     logout(app) {
//         app.post('/logout', (req, res) => {
//             if (req.session.userID) {
//                 // if the user is already logged in then when they click on logout we will destroy the session
//                 req.session.destroy();
//                 res.json({
//                     success: true
//                 })
//                 return true;
//             } else {
//                 // you cant log out is no session has been set
//                 res.json({
//                     success: false
//                 })
//                 return false;
//             }
//         })
//     }
//
//     signup(app, db) {
//         app.post('/signup', (req, res) => {
//
//             let email = req.body.username;
//             let password = bcrypt.hashSync(req.body.password, 9);
//
//             // --------Keys --------
//             // a. Generate a random 128-bit key (k1), a random 128-bit IV, and a random salt (64 bits is probably sufficient).
//             let study_key_k1 = crypto.randomBytes(16);
//             let salt = crypto.randomBytes(16);
//             // The initialization vector
//             let init_vector = crypto.randomBytes(16);
//
//             let salt_toHex = aesjs.utils.hex.fromBytes(salt);
//             let init_vector_toHex = aesjs.utils.hex.fromBytes(init_vector);
//
//             // Step b -- k2
//             let derivedKey_k2 = pbkdf2.pbkdf2Sync(password, salt, 2300, 16, 'sha512');
//             let aesCbc = new aesjs.ModeOfOperation.cbc(derivedKey_k2, init_vector);
//             let encryptedBytes = aesCbc.encrypt(study_key_k1);
//
//             let studyKey_encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
//
//             // --------These values will be hard coded   --------
//
//             // Todo: change this:
//             let status = 1; // e.g. active, inactive
//             let authorised = 1; // e.g. authorised, unauthorised
//             let verified = 1; // e.g. verified, unverified
//             let created = 1; // e.g. active, inactive
//             let question1 = 1;
//             let answer1 = 'We should change this';
//             let question2 = 1
//             let answer2 = 'We should change this';
//             let type = 3; //account type,
//             let organisationID = 1; //account type,
//
//
//             // we need to check if the user already exist
//             db.query('SELECT * FROM Users WHERE eMail = ? LIMIT 1', [email], (error, data, fields) => {
//                 if (data.length > 0) {
//                     console.log("User already exist error");
//                     return res.status(409).json({
//                         error: true,
//                         message: "Email already exists"
//                     });
//                 } else {
//                     // register user
//                     let input_signup =
//                         "INSERT INTO " + "Users (eMail, Password, StudyKey, Salt, IV," + " Status, " +
//                         "Authorised, Verified," + " SecurityQuestion1,SecurityAnswer1," +
//                         "SecurityQuestion2,SecurityAnswer2,AccountType,OrganisationID) " +
//                         "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
//
//                     console.log("input_signup", input_signup)
//                     db.query(input_signup, [email, password, studyKey_encryptedHex, salt_toHex,
//                         init_vector_toHex, status, authorised, verified, question1, answer1,
//                         question2, answer2, type, organisationID], (error, results) => {
//
//                         if (error) {
//                             console.log("email already exist")
//                             console.log("error", error)
//                             return res.status(409).json({
//                                 error: true,
//                                 message: "Email already exists"
//                             });
//                         } else {
//                             console.log("Data inserted successfully");
//                             return res.json({status: 'success', serverStatus: results});
//                         }
//                     });
//                 }
//             })
//
//         })
//     }
//
//     submitStudyData(app, db) {
//         app.post('/submitstudy', (req, res) => {
//
//             let studyData = req.body.studyData;
//
//             // register user
//             let submittedData = "INSERT INTO StudyData (submittedData) VALUES (?)";
//             console.log("input_signup", submittedData)
//             db.query(submittedData, [studyData], (error, results) => {
//
//                 if (error) {
//                     console.log("An error occurred ->", error)
//                     return res.status(409).json({
//                         error: true,
//                         message: "Data insertion was unsuccessful"
//                     });
//                 } else {
//                     console.log("Data inserted successfully");
//                     return res.json({status: 'success', serverStatus: results});
//                 }
//             });
//         });
//     }
//
//     getStudyData(app, db) {
//         app.get('/submitstudy', (req, res) => {
//             // register user
//             let getData = "SELECT * FROM StudyData LIMIT 1";
//
//             db.query(getData, (error, data, results) => {
//                 if (error) {
//                     return res.status(409).json({
//                         error: true,
//                         message: "Email already exists"
//                     });
//                 } else {
//                     let submittedData = data[0].submittedData
//                     return res.json({status: 'success', studyData: submittedData});
//                 }
//             });
//         });
//     }
//
//     // get all levels
//     getStudyGroups(app, db) {
//         let timeFormat = 'YYYY-MM-DDTHH:mm:ss';
//         app.get('/studygroups', (req, res) => {
//             let clientTime = req.query.time;
//             console.log(clientTime)
//
//             let categoriesJSONQuery = "SELECT * FROM Settings ORDER BY Id DESC LIMIT 1;"
//
//             db.query(categoriesJSONQuery, (error, data) => {
//                 if (error) {
//                     return res.status(409).json({
//                         error: true,
//                         message: "Email already exists"
//                     });
//                 } else {
//                     let parseDataStage1 = data[0];
//                     let parseDataStage2 = JSON.parse(parseDataStage1.JSONObject); // JSONObject is the column name
//                     let serverTime = parseDataStage1.CategoryTimestamp; // JSONObject is the column name
//
//                     clientTime = moment(clientTime).format(timeFormat);
//                     serverTime = moment(serverTime).format(timeFormat);
//
//                     if (clientTime === serverTime) {
//                         return res.json({status: 'upToDate'});
//                     } else {
//                         return res.json({
//                             status: 'new',
//                             time: parseDataStage1.CategoryTimestamp,
//                             categories: parseDataStage2
//                         });
//                     }
//                 }
//             });
//
//         });
//     }
//
//
//     getCategories(app, db) {
//
//         app.get('/getcategory', (req, res) => {
//             let categoriesQuery = "SELECT * FROM Categories ORDER BY 'SIC';"
//
//             db.query(categoriesQuery, function (error, results, fields) {
//                 if (error) {
//                     console.log(error); // TODO: add error handling
//                 }
//
//                 fs.writeFile("categories.json", JSON.stringify(results), function (err) {
//                     if (err) {
//                         console.log(err);
//                     }
//                 });
//                 return res.json({categories: results});
//             });
//
//         });
//     }
//
//
//
//
//     getPaymentHistory(app, db) {
//         app.get('/getPaymentHistory', (req, res) => {
//             const userid = req.query.userid;
//             const sorting_field = req.query.sortingfield;
//             const sorting_order = req.query.sortingorder;
//             const search_field = req.query.searchfield;
//             const search_value = req.query.searchvalue;
//
//             let categoriesQuery = "{insert sql command here}"; // build your query here
//
//             db.query(categoriesQuery, function (error, results, fields) {
//                 if (error) {
//                     console.log(error); // TODO: add error handling
//                 }
//
//                 // pass the returned results here
//                 return res.json({paymentHistory: results});
//             });
//
//         });
//     }
// }
//
// module.exports = router;