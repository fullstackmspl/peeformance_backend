const nodemailer = require('nodemailer');
const settingProvider = require('./settingsProvider');

async function send(message) {
    
    let transportSettings = await settingProvider.GetSettings();
    let transporter = nodemailer.createTransport(transportSettings);
    try {
        let info = await transporter.sendMail(message);
    }
    catch(er)
    {
        console.log(er);
    }
    
    //console.log(nodemailer.getTestMessageUrl(info));
}

module.exports = {
    send
}

