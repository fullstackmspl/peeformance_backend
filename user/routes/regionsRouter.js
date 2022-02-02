const express = require('express');
const regionsController = require('../controllers/regionsController');

const router = express.Router();

router.get('/regions', regionsController.getRegions);
router.get('/regions/top3', regionsController.getTop3Region);
router.get('/regions/:regionId', regionsController.getRegionById);
router.get('/regions/:parentId/datapoint', regionsController.getRegionChild);


module.exports = router;