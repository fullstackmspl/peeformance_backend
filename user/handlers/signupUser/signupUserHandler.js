const emailValidators = require('../checkAccount/emailValidators');
const userRepository = require('./../../repositories/userRepository');
const passwordValidators = require('./passwordValidators');
const passwordHasher = require('./passwordHasher');
const db = require('./../../db');
const userFactory = require('./userFactory');
const tokenFactory = require('./tokenFactory');
const messageFactory = require('./../../emails/messageFactory');
const emailService = require('./../../services/emailService');
const temporaryUserRepository = require('../../repositories/temporaryUserRepository');

async function handle(userData) {
	const email = userData.email;
	const emailValidationResult = emailValidators.validateEmail(email);

	if (emailValidationResult.isError) return emailValidationResult;

	const passwordValidationResult = passwordValidators.validatePassword(userData.password);

	if (passwordValidationResult.isError) return passwordValidationResult;

	const existedEmailResult = await userRepository.checkExistedUserByEmail(email);

	if (existedEmailResult)
		return {
			error: `email ${userData.email} already registered`,
			isError: true,
		};

	const userActivationInProgress = await temporaryUserRepository.checkActivationInProgres(email);

	if (userActivationInProgress)
		return {
			error: `email ${userData.email} activation in progress`,
			isError: true,
		};

	const hashResult = passwordHasher.makeHash(userData.password);
	const password = hashResult.password;
	const studyKey_encryptedHex = hashResult.studyKey_encryptedHex;
	const salt_toHex = hashResult.salt_toHex;
	const init_vector_toHex = hashResult.init_vector_toHex;
	const tokenData = tokenFactory.create();
	// --------These values will be hard coded   --------

	// Todo: change this:
	let userstatus = 1;
	let question1 = 1;
	let answer1 = 'We should change this';
	let question2 = 1;
	let answer2 = 'We should change this';
	let type = 3;
	let organisationID = 1;

	const dataToInsert = userFactory.createTemporary(
		userData.email,
		userData.firstName,
		userData.surname,
		password,
		studyKey_encryptedHex,
		salt_toHex,
		init_vector_toHex,
		userstatus,
		question1,
		answer1,
		question2,
		answer2,
		type,
		organisationID,
		tokenData.Token,
		tokenData.Expiration
	);
	try {
		await temporaryUserRepository.addUser(dataToInsert);
	} catch (error) {
		console.log(error);
		//db.rollback();
		return {
			error,
			isError: true,
		};
	}
	const message = messageFactory.createMessage('ActivationAccountMessage', {
		to: dataToInsert.email,
		userName: dataToInsert.firstName,
		token: dataToInsert.Token,
	});
	await emailService.send({ ...message });
	return {
		isError: false,
	};
}

module.exports = {
	handle,
};
