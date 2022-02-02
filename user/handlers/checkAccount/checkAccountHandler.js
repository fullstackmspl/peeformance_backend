const domainExtractor = require('./domainExtractor');
const userRepository = require('../../repositories/userRepository');
const temporaryUserRepository = require('../../repositories/temporaryUserRepository');
const organisationRepository = require('../../repositories/organisationsRepository');

async function handle(email) {

    const domainResult = domainExtractor.getDomainFromEmail(email);
    
    if (domainResult.isError)
        return domainResult;

    const response ={        
        isError: false
    }

    let userExists = await userRepository.checkExistedUserByEmail(email);
    
    if (userExists)  {
        response.userExists=true;
        return response;
    }

    response.userExists=false;

    const userActivationInProgress = await temporaryUserRepository.checkActivationInProgres(email);
    
    if (userActivationInProgress)        {
        response.userActivationInProgress=true;
        return response;
    }

    response.userActivationInProgress=false;
    
    const organisatiDomainExist = await organisationRepository.checkDomainExists(domainResult.value);
    
    response.domainInOrganization = organisatiDomainExist;
    return response;  
}

module.exports = {
    handle
}

