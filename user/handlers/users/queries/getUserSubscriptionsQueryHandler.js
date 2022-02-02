const userRepository = require('./../../../repositories/userRepository');

async function handle(userId) {
    var result = userRepository.getUserSubscriptions(userId);
    return result;
}

module.exports = {
    handle
}