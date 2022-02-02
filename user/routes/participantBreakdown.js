const express = require('express');
const participantBreakdownController = require('../handlers/participantBreakdown/participantBreakdown');

const router = express.Router();
router.get('/participantbreakdowndata/:studyID/datapoint', participantBreakdownController.participantBreakdownData);

module.exports = router;
