const express = require('express');
const loginPanelController = require('../handlers/loginPanel/loginPanelController');

const router = express.Router();

router.get('/', loginPanelController.startPage);
router.post('/', loginPanelController.startServer);
router.post('/login', loginPanelController.login);
router.post('/logout', loginPanelController.logout);

module.exports = router;
