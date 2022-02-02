let crypto = require('crypto');
const bcrypt = require('bcrypt');
const aesjs = require('aes-js');
const pbkdf2 = require('pbkdf2');
const db = require('../../db');

try {
	crypto = require('crypto');
	console.log('crypto loaded successfully');
} catch (err) {
	console.log('crypto support is disabled!');
}

exports.signup = (req, res) => {
	let email = req.body.username;
	let password = bcrypt.hashSync(req.body.password, 9);
	//console.log(req);
	// --------Keys --------
	// a. Generate a random 128-bit key (k1), a random 128-bit IV, and a random salt (64 bits is probably sufficient).
	let study_key_k1 = crypto.randomBytes(16);
	let salt = crypto.randomBytes(16);
	// The initialization vector
	let init_vector = crypto.randomBytes(16);

	let salt_toHex = aesjs.utils.hex.fromBytes(salt);
	let init_vector_toHex = aesjs.utils.hex.fromBytes(init_vector);

	// Step b -- k2
	let derivedKey_k2 = pbkdf2.pbkdf2Sync(password, salt, 2300, 16, 'sha512');
	let aesCbc = new aesjs.ModeOfOperation.cbc(derivedKey_k2, init_vector);
	let encryptedBytes = aesCbc.encrypt(study_key_k1);

	let studyKey_encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

	// --------These values will be hard coded   --------

	// Todo: change this:
	let status = 1; // e.g. active, inactive
	let authorised = 1; // e.g. authorised, unauthorised
	let verified = 1; // e.g. verified, unverified
	let created = 1; // e.g. active, inactive
	let question1 = 1;
	let answer1 = 'We should change this';
	let question2 = 1;
	let answer2 = 'We should change this';
	let type = 3; //account type,
	let organisationID = 1; //account type,

	// we need to check if the user already exist
	db.query('SELECT * FROM Users WHERE eMail = ? LIMIT 1', [email], (error, data, fields) => {
		if (data.length > 0) {
			console.log('User already exist error');
			return res.status(409).json({
				error: true,
				message: 'Email already exists',
			});
		} else {
			// register user
			let input_signup =
				'INSERT INTO ' +
				'Users (eMail, Password, StudyKey, Salt, IV,' +
				' Status, ' +
				'Authorised, Verified,' +
				' SecurityQuestion1,SecurityAnswer1,' +
				'SecurityQuestion2,SecurityAnswer2,AccountType,OrganisationID) ' +
				'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

			console.log('input_signup', input_signup);
			db.query(
				input_signup,
				[
					email,
					password,
					studyKey_encryptedHex,
					salt_toHex,
					init_vector_toHex,
					status,
					authorised,
					verified,
					question1,
					answer1,
					question2,
					answer2,
					type,
					organisationID,
				],
				(error, results) => {
					if (error) {
						console.log('email already exist');
						console.log('error', error);
						return res.status(409).json({
							error: true,
							message: 'Email already exists',
						});
					} else {
						console.log('Data inserted successfully');
						return res.json({ status: 'success', serverStatus: results });
					}
				}
			);
		}
	});
};
