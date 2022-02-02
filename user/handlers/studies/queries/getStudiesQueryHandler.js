const studiesRepository = require('../../../repositories/studiesRepository');

async function handle(peerGroupId) {
    let result = await studiesRepository.getStudiesByPeerGroupId(peerGroupId);
    return result;
}

module.exports = {
    handle
}