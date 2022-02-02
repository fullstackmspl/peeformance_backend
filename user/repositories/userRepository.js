const db = require('./../db');
const sqlCreator = require('./sqlCreator');
const table = "users";
const fetch = (sql, par) => {
    return new Promise((resolve, reject) => {
        db.query(sql, par, (error, result) => {
            if (error) return reject(error);
            return resolve(result);
        });
    });
};

async function getTokenInfo(token) {
    const sql = 'SELECT * FROM users WHERE AuthorizationToken=?';
    const result = await fetch(sql, token);

    return result;
}

async function verifyAuthToken(token) {
    const sql =
        'SELECT eMail, AuthorizationEmail, AuthorizationTokenExpiration FROM users WHERE AuthorizationToken=?';
    const result = await fetch(sql, token);

    return result;
}

async function checkDomainAlreadyExists(domain) {
    let par = '%' + domain;
    let sql = 'SELECT count(*) as value FROM Users WHERE eMail like N?';

    var result = await fetch(sql, par);
    let existedRows = result[0].value;
    return existedRows > 0;
}

async function checkExistedUserByEmail(email) {
    const sql = 'SELECT count(*) as value FROM users WHERE eMail=?';
    const result = await fetch(sql, email);
    const existedRows = result[0].value;
    return existedRows > 0;
}

async function addUser(userData) {
    const sql =
        'INSERT INTO ' +
        'Users (eMail, Name, Surname, Password, ' +
        'StudyKey, Salt, IV, Status, Authorised, ' +
        'Verified, SecurityQuestion1, SecurityAnswer1, ' +
        'SecurityQuestion2, SecurityAnswer2, AccountType, ' +
        'OrganisationID, AuthorizationToken, AuthorizationTokenExpiration, AuthorizationEmail) ' +
        'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    await fetch(sql, Object.values(userData));
}

async function updateUser(token, expiration, email) {
    const sql =
        'UPDATE users SET AuthorizationToken=?, AuthorizationTokenExpiration=? WHERE eMail=?';
    const result = await fetch(sql, [token, expiration, email]);

    return result;
}

async function authorizeUser(email) {
    const sql =
        'UPDATE users SET AuthorizationToken=NULL, AuthorizationTokenExpiration=NULL, Authorised=1 WHERE eMail=?';
    const result = await fetch(sql, email);

    return result;
}

// Added the region id
async function getUserInfo(userId) {
    const sql = 'select u.ID, u.eMail, u.Name, u.Surname, u.StudyKey, u.Salt, ' +
        'u.IV, u.Status, u.Authorised, u.Verified, u.AccountType, u.RegionID, u.OrganisationID, ' +
        'u.Peer_Group_ID,  org.Name as org_name from Users u ' +
        'inner join Organisation org on org.id=u.OrganisationID ' +
        'where u.id=?';
    const result = await fetch(sql, userId);
    const { OrganisationID, org_name, ...userInfo } = result[0];

    userInfo["Company"] = {
        id: OrganisationID,
        name: org_name
    }
    return userInfo;
}

// we have added region id here
async function getUserSubscriptions(userId) {
    let sql = 'SELECT s.ID, s.StudyID, s.UserID, st.Type, s.Created, std.Name, ' +
        's.Activated, s.ValidUntil, s.Active, std.PeerGroupID, std.RegionID, std.NumOfSubscribers, std.About' +
        ' FROM subscriptions s ' +
        'left join subscriptiontypes st on s.SubscriptionTypeID=st.ID ' +
        'left join studies std on std.ID=s.StudyID ' +
        'where s.UserID=? ' +
        'order by std.NumOfSubscribers desc'

    let result = await fetch(sql, userId);
    return result;
}

async function updateUserr(fields, condition) {
    let sqlResult = sqlCreator.update(fields, condition, table);

    let result = await fetch(sqlResult.sql, sqlResult.values);
    return result;
}


module.exports = {
    getTokenInfo,
    verifyAuthToken,
    checkDomainAlreadyExists,
    checkExistedUserByEmail,
    addUser,
    updateUser,
    authorizeUser,
    getUserInfo,
    getUserSubscriptions,
    updateUserr
};
