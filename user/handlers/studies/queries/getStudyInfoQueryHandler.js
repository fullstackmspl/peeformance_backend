const studiesRepository = require('../../../repositories/studiesRepository');

async function handle(studyId) {
    let result = await studiesRepository.getStudyInfoById(studyId);
    console.log(result);
    return result;
}

module.exports = {
    handle
}