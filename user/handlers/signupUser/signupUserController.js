const db = require('../../db');
const signupUserHandler = require('./signupUserHandler');
const temporaryUserRepository = require('../../repositories/temporaryUserRepository');
const userRepository = require('../../repositories/userRepository');
const organizationRepository = require('../../repositories/organisationsRepository');
const messageFactory = require('../../emails/messageFactory');
const tokenFactory = require('../signupUser/tokenFactory');
const emailService = require('../../services/emailService');

exports.signupUser = async (req, res) => {
	const userData = {
		email: req.body.email,
		password: req.body.password,
		firstName: req.body.firstName,
		surname: req.body.surname,
	};

	const result = await signupUserHandler.handle(userData);

	if (result.isError) res.status(400).json(result);
	else res.status(201).json(result);
};

exports.getDictionaries = (req, res) => {
	const questionsOne = 'SELECT * FROM SecurityQuestionsList1 ORDER BY ID;';
	const questionsTwo = 'SELECT * FROM SecurityQuestionsList2 ORDER BY ID;';

	db.query(`${questionsOne}${questionsTwo}`, function (error, results) {
		if (error) {
			console.log(error);
			res.status(400).json({ error });
		}

		const dict = {
			securityQuestions: {
				q1: results[0],
				q2: results[1],
			},
		};

		return res.json(dict);
	});
};

exports.getCompanyDictionaries = (req, res) => {
	const numberOfEmployees =
		'SELECT ID, NumberOfEmployeesBrackets AS value FROM NumberOfEmployees ORDER BY ID;';
	const annualRevenue = 'SELECT ID, AnnualRevenueBrackets AS value FROM AnnualRevenue ORDER BY ID;';
	const reach = 'SELECT ID, Reach AS value FROM Reach ORDER BY ID;';

	db.query(`${numberOfEmployees}${annualRevenue}${reach}`, function (error, results) {
		if (error) {
			console.log(error);
			res.status(400).json({ error });
		}

		const dict = {
			numberOfEmployees: results[0],
			annualRevenue: results[1],
			reach: results[2],
		};

		return res.json(dict);
	});
};

exports.createUser = async (req, res) => {
	const result = await temporaryUserRepository.getUser(req.body.email);
	const { Token, Expiration } = tokenFactory.create();

	const userData = {
		email: result[0].eMail,
		name: result[0].FirstName,
		surname: result[0].Surname,
		password: result[0].Password,
		studyKey: result[0].StudyKey,
		salt: result[0].Salt,
		iv: result[0].IV,
		status: 1,
		authorised: 0,
		verified: 1,
		securityQuestion1: req.body.firstQuestion,
		securityAnswer1: req.body.firstAnswer,
		securityQuestion2: req.body.secondQuestion,
		securityAnswer2: req.body.secondAnswer,
		accountType: 1,
		organizationId: req.body.organizationId,
		authToken: Token,
		authTokenExpiration: Expiration,
		authorizationContactEmail: req.body.authorizationContactEmail,
	};

	try {
		await userRepository.addUser(userData);
	} catch (error) {
		console.log(error);
		db.rollback();

		res.status(400).json({ error, isError: true });
	}

	try {
		await temporaryUserRepository.deleteUser(result[0].Id);
	} catch (error) {
		console.log(error);
		db.rollback();

		res.status(400).json({ error, isError: true });
	}

	const companyName = await organizationRepository.getCompanyName(userData.organizationId);

	const message = messageFactory.createMessage('AuthorizationEmailMessage', {
		to: req.body.authorizationContactEmail,
		nominatedName: req.body.authorizationContactEmail.split('@')[0],
		companyName: companyName[0].Name,
		userName: `${userData.name} ${userData.surname}`,
		token: Token,
	});

	await emailService.send({ ...message });

	return res.status(201).json({
		isError: false,
		message: 'Successfully created user.',
	});
};

exports.createCompany = async (req, res) => {
	const companyData = {
		name: req.body.name,
		numberOfEmployees: req.body.numberOfEmployees,
		annualRevenue: req.body.annualRevenue,
		reach: req.body.reach,
		domain: req.body.domain,
	};

	try {
		const result = await organizationRepository.createCompany(companyData);

		res.status(201).json({
			isError: false,
			message: 'Successfully created organization.',
			organizationId: result.insertId,
		});
	} catch (error) {
		console.log(error);
		db.rollback();

		res.status(400).json({ error, isError: true });
	}
};
