const studiesRepository = require('../../../repositories/studiesRepository');

async function handle(query) {

    let result = await studiesRepository.getDataPoints(query.userId, query.studyID);
    return {
        error: false,
        data: result
    }
}

module.exports = {
    handle
}