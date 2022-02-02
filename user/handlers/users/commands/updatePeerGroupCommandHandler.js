const userRepository = require('../../../repositories/userRepository');

const categoriesRepository = require('../../../repositories/categoriesRepository');

exports.handle = async (command) => {
    let result = await categoriesRepository.exists({ID: command.peerGroupId, Level: 6});
    if (!result)
        return {
            error: true,
            message: `Peer group with id ${command.peerGroupId} and level 6 not found`
        }

    await userRepository.updateUserr({peer_group_id: command.peerGroupId}, {ID: command.userId})
    return {
        error: false
    }
}