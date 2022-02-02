const express = require('express');
const peerGroupController = require('../controllers/peerGroupController');

const router = express.Router();

router.get('/peergroup/:peerGroupId/', peerGroupController.getPeerGroupById);

module.exports = router;