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
	const sql = 'SELECT count(*) as value FROM users WHERE eMail COLLATE UTF8_GENERAL_CI =?';
	const result = await fetch(sql, email);
	const existedRows = result[0].value;
	return existedRows > 0;
}

async function addUser(userData) {
	const sql =
		'INSERT INTO ' +
		'users (eMail, Name, Surname, Password, StudyKey, Salt, IV, AuthorizationToken, AuthorizationTokenExpiration) ' +
		'VALUES (?,?,?,?,?,?,?,?,?)';
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
			//userData.userstatus,
			//userData.question1,
			//userData.answer1,
			//userData.question2,
			//userData.answer2,
			//userData.type,
			//userData.organisationID,
			userData.Token,
			userData.Expiration,
		]);
	//console.log(myresult);
}

async function getTokenInfo(token) {
	const sql = 'SELECT * FROM users WHERE AuthorizationToken=?';
	const result = await fetch(sql, token);

	return result;
}

async function verifyToken(token) {
	const sql = 'SELECT eMail, AuthorizationTokenExpiration FROM users WHERE AuthorizationToken=?';
	const result = await fetch(sql, token);

	return result;
}

async function getUser(email) {
	const sql = 'SELECT * FROM users WHERE eMail=?';
	const result = await fetch(sql, email);

	return result;
}

async function updateUser(token, expiration, email) {
	const sql = 'UPDATE users SET AuthorizationToken=?, AuthorizationTokenExpiration=? WHERE eMail=?';
	const result = await fetch(sql, [token, expiration, email]);

	return result;
}

async function deleteUser(id) {
	const sql = 'DELETE FROM users WHERE ID=?';
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
