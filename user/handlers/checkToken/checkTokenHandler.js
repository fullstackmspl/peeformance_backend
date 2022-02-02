const temporaryUserRepository = require('../../repositories/temporaryUserRepository');
const tokenValidator = require('./tokenValidators');

async function handle(token) {
	let result = await temporaryUserRepository.getTokenInfo(token);

	if (result.length === 0)
		return {
			error: 'token not found',
			isError: true,
		};

	const tokenInfo = { ...result[0] };

	const tokenValidationResult = tokenValidator.validate(tokenInfo);

	if (tokenValidationResult.isError) return tokenValidationResult;

	return {
		isError: false,
	};
}

module.exports = {
	handle,
};
