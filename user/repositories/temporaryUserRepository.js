const db = require('./../db');

const fetch = (sql, par) => {
	return new Promise((resolve, reject) => {
		db.query(sql, par, (error, result) => {
			if (error) return reject(error);
			return resolve(result);
		});
	});
};

async function checkActivationInProgres(email) {
	const sql = 'SELECT count(*) as value FROM tmp_users WHERE eMail COLLATE UTF8_GENERAL_CI =?';
	const result = await fetch(sql, email);
	const existedRows = result[0].value;
	return existedRows > 0;
}

async function addUser(userData) {
	const sql =
		'INSERT INTO ' +
		'users (eMail, Name, Surname, Password, StudyKey, Salt, IV) ' +
		'VALUES (?,?,?,?,?,?,?)';
	//await fetch(sql, Object.values(userData));
	let myresult = db.query(
		sql,
		[
			userData.email,
			userData.firstName,
			userData.surname,
			userData.password,
			userData.studyKey_encryptedHex,
			userData.salt_toHex,
			userData.init_vector_toHex,
		]);
	console.log(myresult);
}

async function getTokenInfo(token) {
	const sql = 'SELECT * FROM tmp_users WHERE Token=?';
	const result = await fetch(sql, token);

	return result;
}

async function verifyToken(token) {
	const sql = 'SELECT eMail, Expiration FROM tmp_users WHERE Token=?';
	const result = await fetch(sql, token);

	return result;
}

async function getUser(email) {
	const sql = 'SELECT * FROM tmp_users WHERE eMail=?';
	const result = await fetch(sql, email);

	return result;
}

async function updateUser(token, expiration, email) {
	const sql = 'UPDATE tmp_users SET Token=?, Expiration=? WHERE eMail=?';
	const result = await fetch(sql, [token, expiration, email]);

	return result;
}

async function deleteUser(id) {
	const sql = 'DELETE FROM tmp_users WHERE ID=?';
	const result = await fetch(sql, id);

	return result;
}

module.exports = {
	checkActivationInProgres,
	addUser,
	getTokenInfo,
	verifyToken,
	getUser,
	deleteUser,
	updateUser,
};
