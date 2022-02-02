const regionsRepository = require('../../../repositories/regionsRepository');

async function handle() {   
        let result = await regionsRepository.getAllRegions();        
        return result; 
}

// Get the first three regions - All of UK, Europe, Global,
async function handleTop3Regions() {
    let result = await regionsRepository.getTop3Regions();
    return result;
}

// Get the Region By ID
async function handleRegionByID(regionId) {
    let result = await regionsRepository.getRegionById(regionId);
    return result;
}
// Get the first three regions - All of UK, Europe, Global,
async function handleRegionChild(parentId) {
    let result = await regionsRepository.getRegionChild(parentId);
    return result;
}

module.exports = {
    handle,
    handleTop3Regions,
    handleRegionByID,
    handleRegionChild
}