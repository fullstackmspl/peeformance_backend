const express = require('express');
const categoryController = require('../handlers/category/categoryController');
const participantBreakdownController = require("../handlers/participantBreakdown/participantBreakdown");

const router = express.Router();

router.get('/getcategory', categoryController.getCategory);

module.exports = router;
