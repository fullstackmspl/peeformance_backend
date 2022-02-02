const userRepository = require('../../../repositories/userRepository');
const subscriptionsRepository = require('../../../repositories/subscriptionsRepository');
const studiesRepository = require('../../../repositories/studiesRepository');

async function handle(userData) {

    let currentDate = new Date();
    let day = currentDate.getDate();
    let month = currentDate.getMonth()+1;
    let thisYear = currentDate.getFullYear();
    let nextYear = currentDate.getFullYear()+1;
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let seconds = currentDate.getSeconds();
    let dateTime = thisYear + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

    let dateTimeNextYear = nextYear + "-" + month  + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

    let studyExistsResult = await studiesRepository.exists({ID: userData.studyId})    
        if (!studyExistsResult) {
            return {
                error: true,
                message: "Study not found"
            };
        }    
    
    let existedSubscriptionResult = await subscriptionsRepository.exists({UserId: userData.userId, StudyID: userData.studyId});
        
        if (existedSubscriptionResult)
            return {
                error: true,
                message: "Subscription already added"
            };
        
        let subscriptionData = {
            UserId: userData.userId,
            StudyId: userData.studyId,
            SubscriptionTypeID: 1,            
            Active: 1,
            Activated: dateTime,
            ValidUntil: dateTimeNextYear
        }
        let result = await subscriptionsRepository.addSubscription(subscriptionData);       
        
        return result;
}

module.exports = {
    handle
}