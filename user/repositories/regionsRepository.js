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

async function getAllRegions() {
    const sql = `SELECT r.ID, r.Level, r.ParentID, r.Name, rt.Name as RegionTypeName FROM regions r inner join regiontypes rt on r.RegionTypesID=rt.ID`;
    const result = await fetch(sql);
    return result;
}

// This will get RegionTypesID 1 to 3
async function getTop3Regions() {
    const sql = `SELECT * FROM regions where Level <= 3`;
    const result = await fetch(sql);
    // console.log("This is the result from the backend", result)
    return result;
}

// This will get all of the Regions child
async function getRegionById(regionId) {
    regionId = parseInt(regionId);
    if (regionId === null || regionId === "undefined" || isNaN(regionId)) {
        regionId = 3;
    }
    let sql;
    // Get the id sent from the parent
    sql = `SELECT * FROM regions where ID = ?`
    let result = await fetch(sql, regionId);
    // console.log("This is the result for the region:", result)
    return result;
}

// This will get all of the Regions child
async function getRegionChild(parentID) {
    parentID = parseInt(parentID);
    if (parentID === null || parentID === "undefined" || isNaN(parentID)) {
        parentID = 3;
    }
    let sql;
    // Get the id sent from the parent
    sql = `SELECT * FROM regions where ParentID = ?`
    let result = await fetch(sql, parentID);
    // console.log("These are the children", result)
    return result;
}

module.exports = {
    getAllRegions,
    getTop3Regions,
    getRegionById,
    getRegionChild
}