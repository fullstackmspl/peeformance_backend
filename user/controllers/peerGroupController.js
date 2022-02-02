const getPeerGroupQueryHandler = require('./../handlers/peerGroup/queries/getRegionsQueryHandler');

// RegionTypeID
exports.getPeerGroupById = async (req, res) => {
    let peerGroupId  = req.params.peerGroupId;
    let peerGroupResult = await getPeerGroupQueryHandler.handlePeerGroupByID(peerGroupId);
    return res.status(200).json(peerGroupResult);
}