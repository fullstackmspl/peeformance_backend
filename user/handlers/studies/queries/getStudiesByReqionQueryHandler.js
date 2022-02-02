const studiesRepository = require('../../../repositories/studiesRepository');

async function handle(query) {
    let result = await studiesRepository.getDataPointsByRegion(query.peerGroupId, query.regionId);
    return result;
}

module.exports = {
    handle
}