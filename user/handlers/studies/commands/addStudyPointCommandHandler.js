const dateUtils = require('../../../utils/dateUtils');
const studiesRepository = require('../../../repositories/studiesRepository');
const subscriptionsRepository = require('../../../repositories/subscriptionsRepository');
const tmpStudyDataRepository = require('../../../repositories/tmpStudyDataRepository');

const db = require('../../../db');

async function handle(command) {
    
    let existedSubscriptionResult = await subscriptionsRepository.exists({UserId: command.userId, StudyID: command.studyID});
        
    if (!existedSubscriptionResult)
        return {
            error: true,
            message: "Subscription not found"
        };
    
    let date=dateUtils.getStudyPointDate();
    
    try {
        await db.beginTransaction();
        await studiesRepository.addDataPoint({StudyID: command.studyID, UserId: command.userId, Date: date, Value: command.encryptedValue});
        await tmpStudyDataRepository.Add({StudyID: command.studyID, Date: date,Value: command.value});
        await db.commit();
    }
    catch (er) {
        console.log(er);
        db.rollback();
        return {
            error: true,
            message: er.code
        }
    }

    return {
        error: false
    }
}

module.exports = {
    handle
}