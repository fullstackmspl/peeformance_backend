function validate(tokenInfo) {
	if (tokenInfo.Used === 1)
		return {
			error: 'token already used',
			isError: true,
		};
	if (tokenInfo.Expiration < Date.now())
		return {
			error: 'token has been expired',
			isError: true,
		};

	return {
		isError: false,
	};
}

module.exports = { validate };
