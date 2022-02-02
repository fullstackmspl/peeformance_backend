const express = require('express');
const paymentController = require('../handlers/payment/paymentController');

const router = express.Router();

router.get('/getPaymentHistory', paymentController.paymentHistory);

module.exports = router;
