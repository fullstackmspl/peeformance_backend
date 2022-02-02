const db = require('./../db');
const Console = require("console");

const fetch = (sql, par) => {
    return new Promise((resolve, reject) => {
        db.query(sql, par, (error, result) => {
            if (error) return reject(error);
            return resolve(result);
        });
    });
};

// This will get all of the Regions child
async function getCategoryById(peerGroupId) {
    let level4Or5 = peerGroupId;
    let level6 = peerGroupId;
    let sql;
    // Get the id sent from the parent
    sql = `SELECT Category, sic, Level from categories where sic in (select ParentSIC from categories where ID = ?) or ID  = ? order by Level asc`
    let result = await fetch(sql, [level4Or5, level6]);
    return result;
}

module.exports = {
    getCategoryById
}