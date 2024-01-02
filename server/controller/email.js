const nodemailer = require('nodemailer')
const ejs = require('ejs')
module.exports = class Email {
  constructor(name, email, code = null) {
    this.name = name,
      this.code = code,
      this.to = email,
      this.from = process.env.EMAIL_USERNAME
  }
  Transport() {
    return nodemailer.createTransport(
      {
        service: 'gmail',
        secure: false,
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      })
  }
  async send(template, subject) {
    //1) render template
    const html = await ejs.renderFile(`${__dirname}/../views/emails/${template}.ejs`, {
      name: this.name,
      code: this.code,
      subject
    })
    //2) email options
    const options = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: html,
    }
    //3) send email
    await this.Transport().sendMail(options)
  }
  async welcome() { await this.send('welcome', 'Welcome to Daily Manager') }
  // async verify() { await this.send('verify', 'Verify Email Address') }
  async codeVerification() { await this.send('verificationCode', 'Code Verification') }
}
