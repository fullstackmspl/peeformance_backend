const checkAccountHandler = require('./checkAccountHandler');

exports.checkAccount = async (req, res) => {
	const email = req.body.email;
	var result = await checkAccountHandler.handle(email);

	if (result.isError) res.status(400).json(result);
	else res.status(200).json(result);
};
