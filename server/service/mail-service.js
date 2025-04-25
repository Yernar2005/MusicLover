const nodemailer = require('nodemailer');
const test = require("node:test");

class MailService {
    constructor() {
        this.transporter = null;
        this.initializeTransport()
        // this.transporter = nodemailer.createTransport({
        //     host: 'smtp.ethereal.email'
        //     ,
        //     port: 587
        //     ,
        //     secure: false,
        //     auth: {
        //         user: testAccount.user,
        //         pass: testAccount.pass,
        //     }
        // })
    }

    async initializeTransport() {
        try {

            let testAccount = await nodemailer.createTestAccount();

            this.transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email'
                ,
                port: 587
                ,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                }
            })
            console.log('Email transport initialized with Ethereal account:', testAccount.user);

        } catch (error) {
            console.error('Failed to initialize email transport:', error);

            this.transporter = {
                sendMail: (options) => {
                    console.log('==== EMAIL WOULD BE SENT ====');
                    console.log('To:', options.to);
                    console.log('Subject:', options.subject);
                    console.log('Content:', options.text || options.html);
                    console.log('============================');
                    return Promise.resolve({messageId: 'log-only'});

                }
            }
        }
    }


    async sendActivationMail(to, link) {
        if (!this.transporter) {
            await this.initializeTransport();
        }
        try {
            let info = await this.transporter.sendMail({
                from: '"Your App" <test@example.com>',
                to: to,
                subject: 'Activation Link',
                text: `Please click on the link to activate your account ${link}`

            })
            if (typeof nodemailer.getTestMessageUrl === 'function' && info) {
                const previewUrl = nodemailer.getTestMessageUrl(info);
                if (previewUrl) {
                    console.log('Preview URL: ', previewUrl);
                }
            }
            return info
        } catch (error) {
            console.error('Error sending mail:', error);
            throw error;

        }





        // await this.transporter.sendMail({
        //     from: process.env.SMTP_EMAIL,
        //     to: to,
        //     subject: 'Activation Link',
        // })
    }

}

module.exports = new MailService();