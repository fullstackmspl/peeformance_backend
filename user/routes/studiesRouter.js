const express = require('express');
const studiesController = require('../controllers/studiesController');

const router = express.Router();

router.get('/studies/:id', studiesController.getStudies);
router.get('/studies/:id/info', studiesController.getStudyInfo);
router.get('/studies/:id/:regionId', studiesController.getStudiesByRegion);
router.get('/studydata/:studyID/datapoint', studiesController.getDataPoints);
router.post('/studydata/:studyID/datapoint', studiesController.addDataPoint);
module.exports = router;