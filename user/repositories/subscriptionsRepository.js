const db = require('../db');
const table = 'Subscriptions';
const sqlCreator = require('../repositories/sqlCreator');

const fetch = (sql, par) => {
	return new Promise((resolve, reject) => {
		db.query(sql, par, (error, result) => {
			if (error) return reject(error);
			return resolve(result);
		});
	});
};

exports.addSubscription = async (subscriptionData) => {
    
    let sqlResult = sqlCreator.createInsert(subscriptionData, table);
    console.log("sqlResult.sql:",sqlResult.sql)
    console.log("sqlResult.values:",sqlResult.values)

    try {
        await fetch(sqlResult.sql, sqlResult.values);
    }
    catch (er) {
        console.log("Err " , er, er.code)
        return {
            error: true,
            code: er.code
        }
    }

    return {
        error: false
    }
}

exports.exists = async (subscriptionData) => {
    let sqlResult = sqlCreator.count(subscriptionData, table);
    
    let result = await fetch(sqlResult.sql, sqlResult.values);
    
    let existedRows = result[0].value;
	return existedRows > 0;
}