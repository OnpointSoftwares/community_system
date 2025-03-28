const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main(message, user) {
  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Community System"', // sender address
      to: user, // list of receivers
      subject: "Alerts", // Subject line
      text: message, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Example usage
main("This is a test message", "vincentbettoh@gmail.com").catch(console.error);
