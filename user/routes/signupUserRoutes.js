const express = require('express');
const signupUserController = require('../handlers/signupUser/signupUserController');
const checkTokenController = require('../handlers/checkToken/checkTokenController');
const checkAccountController = require('../handlers/checkAccount/checkAccountController');

const router = express.Router();

router.post('/signupuser', signupUserController.signupUser);
router.get('/securityQuestions', signupUserController.getDictionaries);
router.get('/companyDictionaries', signupUserController.getCompanyDictionaries);
router.post('/createUser', signupUserController.createUser);
router.post('/createCompany', signupUserController.createCompany);

router.post('/checkToken', checkTokenController.checkToken);
router.get('/verifyToken', checkTokenController.verifyToken);
router.get('/verifyAuthToken', checkTokenController.verifyAuthToken);
router.post('/refreshToken', checkTokenController.refreshToken);
router.post('/refreshAuthToken', checkTokenController.refreshAuthToken);

router.post('/checkAccount', checkAccountController.checkAccount);

module.exports = router;
