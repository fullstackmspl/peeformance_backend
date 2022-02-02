class AuthorizationEmailMessage {
	constructor({ to, nominatedName, companyName, userName, token }) {
		this.to = to;
		this.html =
			`<p>Dear ${nominatedName},</p><br />` +
			`<p>A Peerformance account for ${companyName} has recently been set up by ${userName}. ` +
			`Before authorising ${companyName} to participate in any Peerformance studies ` +
			`we require ${companyName}'s senior management approval. ` +
			`Your name was given by ${userName} as someone who can provide this ` +
			`and you have also been approved by Peerformance. Authorising ${companyName} ` +
			`means you agree to all Terms of Participation which can be viewed here.</p>` +
			`<p>To authorise ${companyName} please click ` +
			`<span><a href='${process.env.WEB_DOMAIN}/validateAuthToken?token=${token}' target='_blank' rel='noreferrer'>` +
			`link</a></p></span>`;
		this.subject = `Authorise ${companyName} for Peerformance study participation`;
		this.from = `${process.env.EMAIL_SENDER}`;
	}
}

module.exports = AuthorizationEmailMessage;
