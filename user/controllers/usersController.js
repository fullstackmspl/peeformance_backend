const getUserInfoQueryHandler = require('./../handlers/users/queries/getUserInfoQueryHandler');
const getUserSubscriptionsQueryHandler = require('./../handlers/users/queries/getUserSubscriptionsQueryHandler');
const addSubscriptionCommand = require('../handlers/subscriptions/commands/addSubscriptionCommand');
const updatePeerGroupCommandHandler = require('../handlers/users/commands/updatePeerGroupCommandHandler');
const updateRegionCommandHandler = require('../handlers/users/commands/updateRegionCommandHandler');


exports.getUserInfo = async (req, res) => {
    
    if (!req.user)
        return res.status(400).json({
            error: true,
            message: 'Cannot read logged user data',
        });
    let userInfo = await getUserInfoQueryHandler.handle(req.user.userId);
    return res.status(200).json(userInfo);
};

exports.getUserSubscriptions = async (req, res)=> {
    let userSubscriptions = await getUserSubscriptionsQueryHandler.handle(req.user.userId);
    return res.status(200).json(userSubscriptions);
}

exports.addSubscription = async (req, res)=> {
    let {userId} = req.user;
    let {studyId} = req.body;
    
    let result = await addSubscriptionCommand.handle({userId, studyId});
    if (result.error)
        return res.status(400).json(result);
    
    return res.status(200).json({});
}

exports.updatePeerGroup = async (req, res) => {
    let {peerGroupId} = req.body;
    let {userId} = req.user;

    let result = await updatePeerGroupCommandHandler.handle({peerGroupId, userId});
    
    if (result.error)
        return res.status(400).json(result);
    
    return res.status(200).json({});
}

exports.updateRegion = async (req, res) => {
    let {regionID} = req.body;
    let {userId} = req.user;

    let result = await updateRegionCommandHandler.handle({regionID, userId});

    if (result.error)
        return res.status(400).json(result);

    return res.status(200).json({});
}