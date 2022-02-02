const bcrypt = require('bcrypt');
const db = require('../../db');
const utils = require('../../utils');

exports.startPage = (req, res) => {
    res.send(
        '<div style="align-content: center; align-items: center; text-align: center">' +
        '<hr/>' +
        '<h1 style="text-align: center; color: Red">Naughty Naughty, you should not be here!</h1>' +
        '<hr/>' +
        '<img src="https://i.pinimg.com/originals/c1/bb/af/c1bbaf1dd4705bd3dd448f20d2ba056e.gif" alt="">' +
        '<h1  style="text-align: center; color: black">Server is up :) </h1>' +
        '</div>'
    );
};

exports.startServer = (req, res) => {
    res.send({ message: 'Server is up' });
};

exports.login = (req, res) => {
    const user = req.body.username;
    const password = req.body.password;
    let cols = [user];
    let getLogin = 'SELECT * FROM users WHERE eMail = ? LIMIT 1';

    db.query(getLogin, cols, (error, data, fields) => {
        if (error) {
            return res.status(400).json({
                error: true,
                message: 'Username or Password required.',
            });
        }

        if (data && data.length === 1) {
            // checking if the right password provided by user
            bcrypt.compare(password, data[0].Password, (bcryptErr, verified) => {
                if (verified) {
                    const userData = {
                        userId: data[0].ID,
                        name: data[0].eMail,
                        username: data[0].eMail,
                        studyKey: data[0].StudyKey,
                        salt: data[0].Salt,
                        iv: data[0].IV,
                        isAdmin: true,
                        peerGroupId: data[0].peer_group_id,
                        regionID: data[0].RegionID,
                    };
                    // generate token
                    const token = utils.generateToken(userData);
                    // get basic user details
                    const userObj = utils.getCleanUser(userData);
                    // return the token along with user details
                    return res.json({ user: userObj, token, allUserData: userData });
                } else {
                    return res.status(401).json({
                        error: true,
                        message: 'Invalid password, please try again!',
                    });
                }
            });
        } else {
            // msg: 'User not found, please try again'
            return res.status(401).json({
                error: true,
                message: 'Invalid password, please try again!',
            });
        }
    });
};

exports.logout = (req, res) => {
    if (req.session.userID) {
        // if the user is already logged in then when they click on logout we will destroy the session
        req.session.destroy();
        res.json({
            success: true,
        });
        return true;
    } else {
        // you cant log out is no session has been set
        res.json({
            success: false,
        });
        return false;
    }
};
