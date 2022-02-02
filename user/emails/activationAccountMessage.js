class ActivationAccountMessage {
	constructor({ to, userName, token }) {
		this.to = to;
		this.html =
			`<p>Dear ${userName},</p><br />` +
			`<p>We just need to verify your email address before you can access Peerformance.</p><br>` +
			`<p>Verify your email address ` +
			`<a href='${process.env.WEB_DOMAIN}/validateToken?token=${token}' target='_blank'>Link</a></p><br />` +
			`<p>Many thanks,</p>` +
			`<p>The Peerformance team</p>`;
		this.subject = 'Email address verification email';
		this.from = `${process.env.EMAIL_SENDER}`;
	}
}

module.exports = ActivationAccountMessage;
