const userRepository = require('../../../repositories/userRepository');

async function handle(id) {    
        let result = await userRepository.getUserInfo(id);
        
        return result; 
}

module.exports = {
    handle
}