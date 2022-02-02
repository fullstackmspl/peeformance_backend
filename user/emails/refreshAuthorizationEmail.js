class RefreshAuthorizationEmailMessage {
	constructor({ to, userName, token }) {
		this.to = to;
		this.html =
			`<p>Dear ${userName},</p><br />` +
			`<p>To renew an authorisation process please click ` +
			`<span><a href='${process.env.WEB_DOMAIN}/validateAuthToken?token=${token}' target='_blank' rel='noreferrer'>` +
			`link</a></p></span>`;
		this.subject = `Renew authorisation process for Peerformance study participation`;
		this.from = `${process.env.EMAIL_SENDER}`;
	}
}

module.exports = RefreshAuthorizationEmailMessage;
