const sqlCreator = require('./sqlCreator');
const db = require('./../db');
const table = 'Categories';

const fetch = (sql, par) => {
	return new Promise((resolve, reject) => {
		db.query(sql, par, (error, result) => {
			if (error) return reject(error);
			return resolve(result);
		});
	});
};

exports.exists = async (data) => {
    let sqlResult = sqlCreator.count(data, table);
	
	let result = await fetch(sqlResult.sql, sqlResult.values);
    
    let existedRows = result[0].value;
	return existedRows > 0;

}