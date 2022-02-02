const emailValidators = require('./emailValidators');

function getDomainFromEmail(email) {
    
    const emailValidationResult = emailValidators.validateEmail(email);
    
    if (emailValidationResult.isError)
        return emailValidationResult;
    
    const splited= email.split('@');   

    return  {
        isError: false,
        value: splited[1]
    }
}


module.exports = {
    getDomainFromEmail
}