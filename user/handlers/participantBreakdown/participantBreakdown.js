const db = require('../../db');
const e = require("express");
const sort_by_key = require("../../utils/sortByKeys");
const renameKeys = require("../../utils/renameKeys");

exports.getRange = (req, res) => {
    let query =
        "SELECT MIN(Value) AS Min, MIN(Value) " +
        "+ ((MAX(Value) - MIN(Value)) /4) as Div1, MIN(Value) + " +
        "((MAX(Value) - MIN(Value)) /2) as Div2,  MIN(Value) + " +
        "(3 * (MAX(Value) - MIN(Value)) /4) as Div3, MAX(Value) " +
        "AS MAX FROM `peerformance`.`tempstudydata` WHERE Date = '2021-01-01' AND studyid = 2;";

    db.query(query, function (error, results, fields) {
        if (error) {
            console.log(error);
        }

        // pass the returned results here
        return res.json({ range: results });
    });
}

const fetch = (sql, par) => {
    return new Promise((resolve, reject) => {
        db.query(sql, par, (error, result) => {
            if (error) return reject(error);
            return resolve(result);
        });
    });
};

async function participantRange(studyID, userId) {

    const breakdownQuery = "SELECT MIN(Value) AS Min, MIN(Value) + " +
        "((MAX(Value) - MIN(Value)) /4) as Div1, MIN(Value) + " +
        "((MAX(Value) - MIN(Value)) /2) as Div2,  MIN(Value) + " +
        "(3 * (MAX(Value) - MIN(Value)) /4) as Div3, MAX(Value) " +
        "AS MAX FROM `peerformance`.`tempstudydata` " +
        "WHERE Date = DATE_SUB(get_month_start(get_current_interval_start_date()), INTERVAL 1 MONTH) AND studyid = ?"

    const breakdownResult = await fetch(breakdownQuery, [studyID, userId]);
    let range1 = breakdownResult[0].Min;
    let range2 = breakdownResult[0].Div1;
    let range3 = breakdownResult[0].Div2;
    let range4 = breakdownResult[0].Div3;
    let range5 = breakdownResult[0].MAX

    let query2 = "SELECT COUNT(*) AS Count, TSD.ReachID," +
        "                       CASE WHEN TSD.Value >=" + range1 + " AND TSD.Value < " + range2 + " THEN 'Range1'\n" +
        "             WHEN TSD.Value >= " + range2 + " AND TSD.Value < " + range3 + " THEN 'Range2'\n" +
        "             WHEN TSD.Value >= " + range3 + " AND TSD.Value < " + range4 + " THEN 'Range3'\n" +
        "                                      WHEN TSD.Value >= " + range4 + " AND TSD.Value <= " + range5 + " THEN 'Range4'\n" +
        "             ELSE 'Other'\n" +
        "        END AS 'Range'\n" +
        "FROM subscriptions Subs\n" +
        "LEFT JOIN tempstudydata TSD ON Subs.StudyID = TSD.StudyID\n" +
        "WHERE TSD.StudyID = ?" +
        "  AND Subs.Active = 1" +
        "  AND Subs.UserID = ?" +
        "  AND TSD.`Date` = DATE_SUB(get_month_start(get_current_interval_start_date()), INTERVAL 1 MONTH)\n" +
        "  AND get_current_interval_start_date() BETWEEN Subs.Activated AND Subs.ValidUntil\n" +
        "GROUP BY (CASE WHEN TSD.Value >= " + range1 + " AND TSD.Value < " + range2 + " THEN 'Range1'\n" +
        "              WHEN TSD.Value >= " + range2 + " AND TSD.Value < " + range3 + " THEN 'Range2'\n" +
        "             WHEN TSD.Value >= " + range3 + " AND TSD.Value < " + range4 + " THEN 'Range3'\n" +
        "                                      WHEN TSD.Value >= " + range4 + " AND TSD.Value <= " + range5 + " THEN 'Range4'\n" +
        "               else 'other'\n" +
        "          END), TSD.ReachID;"

    const result = await fetch(query2, [studyID, userId]);
    return { breakdownResult: breakdownResult, result: result };
}


exports.participantBreakdownData = async (req, res) => {
    let { userId } = req.user;
    let { studyID } = req.params;
    let data = await participantRange(studyID, userId);
    return res.json(data);
}





