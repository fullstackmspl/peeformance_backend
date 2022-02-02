const categoryRepository = require('../../../repositories/peerGroupRepository');



// Get the Region By ID
async function handlePeerGroupByID(peerGroupId) {
    let peerGroupResult = await categoryRepository.getCategoryById(peerGroupId);
    return peerGroupResult;
}


module.exports = {
    handlePeerGroupByID,
}