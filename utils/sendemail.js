const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass:process.env.SMTP_PASSWORD,
    },
  });

  // send mail with defined transport object
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // wigwam?
    to: options.recipient,
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  };

  // send email
  const info = await transporter.sendMail(message)

  console.log("Message sent: %s", info.messageId);
}

module.exports = sendEmail;
