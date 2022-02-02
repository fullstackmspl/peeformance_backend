const userRepository = require('../../../repositories/userRepository');

const categoriesRepository = require('../../../repositories/categoriesRepository');

exports.handle = async (command) => {
    let result = await categoriesRepository.exists({ID: command.regionID});
    if (!result)
        return {
            error: true,
            message: `Region location with ID ${command.regionID} not found`
        }
    console.log("command.regionID", command.regionID)
    await userRepository.updateUserr({RegionID: command.regionID}, {ID: command.userId})
    return {
        error: false
    }
}