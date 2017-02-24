const nodeMailer = require('nodemailer');
const config = require('/config');

const transporter = nodeMailer.createTransport(config.mailConfig);

function sendMail (to, data) {
  const mailOptions = {
      from: data.from, // sender address
      to, // receiver
      subject: data.subject, // Subject line
      html: data.html
  };

  transporter.sendMail(mailOptions, (error) => {
       if (error) {
           console.log(error.message);
       }
  });
}

module.exports = sendMail;
