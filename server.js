const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 5501;

// Middleware
app.use(cors()); // Enable CORS for frontend-backend communication
app.use(bodyParser.json()); // Parse JSON data from requests

// POST Endpoint for Contact Form
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send('All fields are required.');
    }

    // Nodemailer Setup
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'lopezkristine749@gamil.com', // Replace with your email
            pass: 'tine2019',    // Replace with your email's app password
        },
    });

    const mailOptions = {
        from: email,
        to: 'nekochii57@gamil.com', // Replace with the email you want to receive the message
        subject: `New Contact Form Message from ${name}`,
        text: `You have received a new message:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Message sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send message.');
    }
});

// Start the Server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
