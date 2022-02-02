const express = require('express');
const usersController = require('../controllers/usersController');

const router = express.Router();

router.get('/users/info', usersController.getUserInfo);
router.get('/users/subscriptions', usersController.getUserSubscriptions);
router.post('/users/subscriptions', usersController.addSubscription);
router.put('/users/peergroup', usersController.updatePeerGroup);
router.put('/users/region', usersController.updateRegion);
module.exports = router;