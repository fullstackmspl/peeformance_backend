const checkTokenHandler = require('./checkTokenHandler');
const temporaryUserRepository = require('../../repositories/temporaryUserRepository');
const userRepository = require('../../repositories/userRepository');
const organizationRepository = require('../../repositories/organisationsRepository');
const messageFactory = require('../../emails/messageFactory');
const tokenFactory = require('../signupUser/tokenFactory');
const domainExtractor = require('../checkAccount/domainExtractor');
const emailService = require('../../services/emailService');

exports.checkToken = async (req, res) => {
	const token = req.body.token;
	const result = await checkTokenHandler.handle(token);

	if (result.isError) res.status(400).json(result);
	else res.status(200).json(result);
};

exports.verifyToken = async function (req, res) {
	let token = req.body.token || req.query.token;
	if (!token) {
		return res.status(400).json({
			error: true,
			message: 'Token is required.',
		});
	}

	const result = await temporaryUserRepository.verifyToken(token);

	if (!result.length) {
		return res.status(401).json({
			isError: true,
			error: 'Invalid token.',
		});
	}

	if (result.length > 0) {
		const expirationTimestamp = new Date(result[0].Expiration).getTime();
		const userEmail = result[0].eMail;

		if (expirationTimestamp < Date.now()) {
			return res.json({
				error: 'Token has been expired',
				isError: true,
				tokenValid: false,
				email: userEmail,
			});
		} else {
			const domainResult = domainExtractor.getDomainFromEmail(userEmail);
			const organization =
				await organizationRepository.checkDomainExistsAndGetOrganizationInfo(
					domainResult.value
				);

			return res.status(200).json({
				isError: false,
				tokenValid: true,
				email: userEmail,
				organization: organization[0] ?? null,
			});
		}
	}
};

exports.verifyAuthToken = async function (req, res) {
	let token = req.body.token || req.query.token;
	if (!token) {
		return res.status(400).json({
			error: true,
			message: 'Token is required.',
		});
	}

	const result = await userRepository.verifyAuthToken(token);

	if (!result.length) {
		return res.status(401).json({
			isError: true,
			error: 'Invalid token.',
		});
	}

	if (result.length > 0) {
		const expirationTimestamp = new Date(result[0].AuthorizationTokenExpiration).getTime();
		const userEmail = result[0].eMail;
		const supervisorEmail = result[0].AuthorizationEmail;

		if (expirationTimestamp < Date.now()) {
			return res.json({
				error: 'Token has been expired',
				isError: true,
				tokenValid: false,
				supervisorEmail: supervisorEmail,
				userEmail: userEmail,
			});
		} else {
			await userRepository.authorizeUser(userEmail);
			return res.status(200).json({
				isError: false,
				tokenValid: true,
			});
		}
	}
};

exports.refreshToken = async (req, res) => {
	const userEmail = req.body.email;
	const { Token, Expiration } = tokenFactory.create();

	await temporaryUserRepository.updateUser(Token, Expiration, userEmail);

	const message = messageFactory.createMessage('ActivationAccountMessage', {
		to: userEmail,
		userName: userEmail.split('@')[0],
		token: Token,
	});
	await emailService.send({ ...message });

	res.status(200).json({
		status: 'success',
	});
};

exports.refreshAuthToken = async (req, res) => {
	const submiterEmail = req.body.submiterEmail;
	const supervisorEmail = req.body.supervisorEmail;
	const { Token, Expiration } = tokenFactory.create();

	await userRepository.updateUser(Token, Expiration, submiterEmail);

	const message = messageFactory.createMessage('RefreshAuthorizationEmailMessage', {
		to: supervisorEmail,
		userName: supervisorEmail.split('@')[0],
		token: Token,
	});
	await emailService.send({ ...message });

	res.status(200).json({
		status: 'success',
	});
};
