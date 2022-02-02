const getRegionsQueryHandler = require('./../handlers/regions/queries/getRegionsQueryHandler');

exports.getRegions = async (req, res) => {
    let regions = await getRegionsQueryHandler.handle();
    return res.status(200).json(regions);
}

// Get top 3 levels
exports.getTop3Region = async (req, res) => {
    let regions = await getRegionsQueryHandler.handleTop3Regions();
    return res.status(200).json(regions);
}

// Get top 3 levels
exports.getRegionChild = async (req, res) => {
    let parentId = req.params.parentId;
    let regions = await getRegionsQueryHandler.handleRegionChild(parentId);
    return res.status(200).json(regions);
}


// RegionTypeID
exports.getRegionById = async (req, res) => {
    let regionId  = req.params.regionId;

    let regions = await getRegionsQueryHandler.handleRegionByID(regionId);
    return res.status(200).json(regions);
}