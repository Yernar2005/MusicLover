// mailService.js
require('dotenv').config();  // 1) грузим .env сразу же

const nodemailer = require('nodemailer');

class MailService {
    constructor() {
        const port = parseInt(process.env.SMTP_PORT, 10);

        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,    // например "smtp.gmail.com"
            port: port,                     // число, не строка
            secure: false,                  // false = STARTTLS
            requireTLS: true,               // форсируем шифрование
            auth: {
                user: process.env.SMTP_USER,      // ваш email
                pass: process.env.SMTP_PASSWORD,  // пароль из .env
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // проверяем соединение сразу при старте
        this.transporter.verify()
            .then(() => console.log('SMTP-сервер готов к отправке писем'))
            .catch(err => console.error('Ошибка подключения к SMTP:', err));
    }

    async sendActivationMail(to, link) {
        try {
            const info = await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: `Активация аккаунта на ${process.env.VITE_API_URL}`,
                text: `Перейдите по ссылке для активации: ${link}`,
                html: `
          <div style="font-family:Arial,sans-serif;line-height:1.5">
            <h1>Активация аккаунта</h1>
            <p>Чтобы завершить регистрацию, кликните на ссылку ниже:</p>
            <a href="${link}" target="_blank">${link}</a>
          </div>
        `
            });
            console.log('Mail sent:', info.messageId);
        } catch (err) {
            console.error('Ошибка отправки письма:', err);
            throw err;
        }
    }
}


module.exports = new MailService();

// Если у вас нет gmail c двух-этапной. тогда можете этот код использовать, это фейковая симуляция почты

//
// const nodemailer = require('nodemailer');
// const test = require("node:test");
//
// class MailService {
//     constructor() {
//         this.transporter = null;
//         this.initializeTransport()
//         // this.transporter = nodemailer.createTransport({
//         //     host: 'smtp.ethereal.email'
//         //     ,
//         //     port: 587
//         //     ,
//         //     secure: false,
//         //     auth: {
//         //         user: testAccount.user,
//         //         pass: testAccount.pass,
//         //     }
//         // })
//     }
//
//     async initializeTransport() {
//         try {
//
//             let testAccount = await nodemailer.createTestAccount();
//
//             this.transporter = nodemailer.createTransport({
//                 host: 'smtp.ethereal.email'
//                 ,
//                 port: 587
//                 ,
//                 secure: false,
//                 auth: {
//                     user: testAccount.user,
//                     pass: testAccount.pass,
//                 }
//             })
//             console.log('Email transport initialized with Ethereal account:', testAccount.user);
//
//         } catch (error) {
//             console.error('Failed to initialize email transport:', error);
//
//             this.transporter = {
//                 sendMail: (options) => {
//                     console.log('==== EMAIL WOULD BE SENT ====');
//                     console.log('To:', options.to);
//                     console.log('Subject:', options.subject);
//                     console.log('Content:', options.text || options.html);
//                     console.log('============================');
//                     return Promise.resolve({messageId: 'log-only'});
//
//                 }
//             }
//         }
//     }
//
//
//     async sendActivationMail(to, link) {
//         if (!this.transporter) {
//             await this.initializeTransport();
//         }
//         try {
//             let info = await this.transporter.sendMail({
//                 from: '"Your App" <test@example.com>',
//                 to: to,
//                 subject: 'Activation Link',
//                 text: `Please click on the link to activate your account ${link}`
//
//             })
//             if (typeof nodemailer.getTestMessageUrl === 'function' && info) {
//                 const previewUrl = nodemailer.getTestMessageUrl(info);
//                 if (previewUrl) {
//                     console.log('Preview URL: ', previewUrl);
//                 }
//             }
//             return info
//         } catch (error) {
//             console.error('Error sending mail:', error);
//             throw error;
//
//         }
//
//
//
//
//
//         // await this.transporter.sendMail({
//         //     from: process.env.SMTP_EMAIL,
//         //     to: to,
//         //     subject: 'Activation Link',
//         // })
//     }
//
// }
//
// module.exports = new MailService();
//
