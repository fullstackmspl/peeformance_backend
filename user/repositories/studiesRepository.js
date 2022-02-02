const db = require('./../db');
const sqlCreator = require('./sqlCreator');
const table = 'Studies';

const fetch = (sql, par) => {
    return new Promise((resolve, reject) => {
        db.query(sql, par, (error, result) => {
            if (error) return reject(error);
            return resolve(result);
        });
    });
};

async function getStudiesByPeerGroupId(peerGroupId) {
    const sql = 'select std.*, st.StudyType as Type, c.Category, pc.Category as ParentCategory  from Studies std inner join StudyTypes st ' +
        'on st.ID=std.TypeId left join Categories c on c.ID=std.PeerGroupID ' +
        'left join Categories pc on pc.SIC=c.ParentSIC ' +
        'where std.PeerGroupID =?'
    var result = await fetch(sql, peerGroupId);
    return result;
}

async function getStudyInfoById(studyId) {
    const sql = 'select * from Studies where ID =?';
    let result = await fetch(sql, studyId);
    return result[0];
}

async function exists(studyData) {
    let sqlResult = sqlCreator.count(studyData, table);

    let result = await fetch(sqlResult.sql, sqlResult.values);

    let existedRows = result[0].value;
    return existedRows > 0;
}

async function getDataPoints(userId, studyID) {

    // let sql = "SELECT usd.Date, usd.Value as Value, IFNULL(asd.Value, 0) as Average " +
    //     "FROM Subscriptions s LEFT JOIN UserStudyData usd " +
    //     "on s.StudyId = usd.StudyId and s.UserID = usd.UserID " +
    //     "Left JOIN AvgStudyData asd " +
    //     "on usd.StudyId = asd.StudyId and usd.`Date` = asd.`Date` " +
    //     "WHERE usd.UserId = ? and s.Active = 1 and s.StudyID = ? and " +
    //     "usd.`Date` BETWEEN s.Activated AND s.ValidUntil AND " +
    //     "usd.`Date` BETWEEN DATE_SUB(get_month_start(get_current_interval_start_date()), INTERVAL 12 MONTH) " +
    //     "AND DATE_SUB(get_month_start(get_current_interval_start_date()), INTERVAL 1 MONTH)";

    let sql2 = "SELECT\n" +
        "  usd.Date,\n" +
        "  usd.Value as Value,\n" +
        "  IFNULL(asd.Value, 0) as Average\n" +
        "FROM\n" +
        "  Subscriptions s\n" +
        "  LEFT JOIN UserStudyData usd on s.StudyId = usd.StudyId\n" +
        "  and s.UserID = usd.UserID\n" +
        "  Left JOIN AvgStudyData asd on usd.StudyId = asd.StudyId\n" +
        "  and usd.`Date` = asd.`Date`\n" +
        "WHERE\n" +
        "  usd.UserId = ?\n" +
        "  and s.Active = 1\n" +
        "  and s.StudyID = ?\n" +
        "  and usd.`Date` BETWEEN get_month_start(get_interval_start_date(s.Activated))\n" +
        "  AND get_month_start(get_interval_start_date(s.ValidUntil))\n" +
        "  AND usd.`Date` BETWEEN DATE_SUB(\n" +
        "    get_month_start(get_current_interval_start_date()),\n" +
        "    INTERVAL 12 MONTH\n" +
        "  )\n" +
        "  AND DATE_SUB(\n" +
        "    get_month_start(get_current_interval_start_date()),\n" +
        "    INTERVAL 1 MONTH\n" +
        "  )"
    let result = await fetch(sql2, [userId, studyID]);
    return result;
}

// This is what we will use for active and que
async function getDataPointsByRegion(PeerGroupID, RegionID) {
    let sql = 'select std.*, st.StudyType as Type, c.Category, pc.Category ' +
        'as ParentCategory  from Studies std inner join StudyTypes st ' +
        'on st.ID=std.TypeId left join Categories c on c.ID=std.PeerGroupID ' +
        'left join Categories pc on pc.SIC=c.ParentSIC ' +
        'where std.PeerGroupID = ? AND std.RegionID = ?'

    let result = await fetch(sql, [PeerGroupID, RegionID]);
    return result;
}


async function addDataPoint(studyData) {
    let sqlResult = sqlCreator.createInsert(studyData, "UserStudyData");
    let res = await fetch(sqlResult.sql, sqlResult.values);
}

module.exports = {
    getStudiesByPeerGroupId,
    getDataPointsByRegion,
    exists,
    getDataPoints,
    addDataPoint,
    getStudyInfoById
}