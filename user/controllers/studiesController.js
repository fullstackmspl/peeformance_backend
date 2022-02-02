const studiesQueryHandler = require('../handlers/studies/queries/getStudiesQueryHandler');
const studiesByRegionQueryHandler = require('../handlers/studies/queries/getStudiesByReqionQueryHandler');
const getDataPointsQueryHandler = require('../handlers/studies/queries/getDataPointsQueryHandler');
const addStudyPointCommandHandler = require('../handlers/studies/commands/addStudyPointCommandHandler');
const getStudyInfoQueryHandler = require('../handlers/studies/queries/getStudyInfoQueryHandler')

exports.getStudies = async (req, res) => {
    let result = await studiesQueryHandler.handle(req.params.id);
    return res.status(200).json(result);
}

exports.getStudyInfo = async (req, res) => {
    let studyId = req.params.id;
    let result = await getStudyInfoQueryHandler.handle(studyId);
    if(!result)
        return res.status(404).json();
    return res.status(200).json(result);
}

/* Get studies by region*/
exports.getStudiesByRegion = async (req, res) => {
    let peerGroupId = req.params.id;
    let regionId = req.params.regionId;

    let result = await studiesByRegionQueryHandler.handle({peerGroupId, regionId});

    if (!result.error) {
        return res.status(200).json(result)
    }
    return res.status(400).json(result);
}


exports.getDataPoints = async (req, res) => {
    let {userId} = req.user;
    let {studyID} = req.params;
    let result = await getDataPointsQueryHandler.handle({userId, studyID});
    if (!result.error)
        return res.status(200).json(result.data);
    return res.status(400).json(result);
}

exports.addDataPoint = async (req, res) => {
    let {userId} = req.user;
    let {studyID} = req.params;
    let {value, encryptedValue} = req.body;

    let result = await addStudyPointCommandHandler.handle({userId, studyID, value, encryptedValue});
    if (!result.error)
        return res.status(200).json(result.data);
    return res.status(400).json(result);
}
