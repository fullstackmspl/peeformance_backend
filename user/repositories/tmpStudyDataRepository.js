const db = require('./../db');
const sqlCreator = require('./sqlCreator');
const table = 'TempStudyData';

const fetch = (sql, par) => {
	return new Promise((resolve, reject) => {
		db.query(sql, par, (error, result) => {
			if (error) return reject(error);
			return resolve(result);
		});
	});
};

async function Add(tempStudyData) {
    let sqlResult = sqlCreator.createInsert(tempStudyData, table);
    await fetch(sqlResult.sql, sqlResult.values);
}

module.exports = {
    Add
}

