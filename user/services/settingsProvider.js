const nodemailer = require("nodemailer");

async function GetSettings() {
    
    if (process.env.TEST_EMAIL_ACCOUNT_ENABLED=='true') {
        let testAccount = await nodemailer.createTestAccount();
        let settings = {
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },            
        }
       
        return settings;
    }
    else {
        
        let settings = {
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE, // true for 465, false for other ports
            secureConnection: false,
            auth: {
                user: process.env.EMAIL_USER, // generated ethereal user
                pass: process.env.EMAIL_PASS, // generated ethereal password
            },
            tls: {
                ciphers:'SSLv3',
                rejectUnauthorized: false,
            }
        }
        console.log(settings);
        return settings;
    }
}

module.exports = {
    GetSettings
}

