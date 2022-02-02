const { v4: uuidv4 } = require('uuid');

function create() {
	const token = uuidv4();
	const today = new Date();
	const expiration = new Date();
	expiration.setDate(today.getDate() + 1);

	const tokenData = {
		Token: token,
		Expiration: expiration,
	};

	return tokenData;
}

module.exports = { create };
