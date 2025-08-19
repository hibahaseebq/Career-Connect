const nodemailer = require('nodemailer');

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.example.com', // Your SMTP server hostname
    port: 587, // Your SMTP server port
    secure: false, // Set to true if your SMTP server requires TLS
    auth: {
        user: 'your_email@example.com', // Your email address
        pass: 'your_email_password' // Your email password
    }
});

// Function to send an email
function sendEmail(to, subject, text, html) {
    const mailOptions = {
        from: 'Your Name <your_email@example.com>',
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.error('Error sending email:', err);
        } else {
        }
    });
}

module.exports = sendEmail;
