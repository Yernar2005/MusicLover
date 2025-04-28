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
                subject: `Активация аккаунта на ${process.env.API_URL}`,
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