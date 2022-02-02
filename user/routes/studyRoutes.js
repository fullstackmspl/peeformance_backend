const express = require('express');
const studyController = require('../handlers/study/studyController');

const router = express.Router();

router.post('/submitstudy', studyController.submitStudy);
router.get('/submitstudy', studyController.getStudy);
router.get('/studygroups', studyController.studyGroups);

module.exports = router;
