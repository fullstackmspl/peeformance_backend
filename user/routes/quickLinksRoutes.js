const express = require('express');
const quickLinksController = require('../handlers/quickLinks/quickLinkController');

const router = express.Router();

router.get('/quicklink', quickLinksController.getQuickLinks);

module.exports = router;
