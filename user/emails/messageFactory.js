const ActivationAccountMessage = require('./activationAccountMessage');
const AuthorizationEmailMessage = require('./authorizationEmail');
const RefreshAuthorizationEmailMessage = require('./refreshAuthorizationEmail');

const message = {
	ActivationAccountMessage,
	AuthorizationEmailMessage,
	RefreshAuthorizationEmailMessage,
};

module.exports = {
	createMessage(type, attributes) {
		const MessageType = message[type];
		return new MessageType(attributes);
	},
};
