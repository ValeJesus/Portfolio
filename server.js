const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'joaodraw5@gmail.com', // Your Gmail
    pass: process.env.GMAIL_APP_PASSWORD // Use environment variable for security
  }
});

// Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

// Route to handle form submission
app.post('/send-email', (req, res) => {
  const { email, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'joaodraw5@gmail.com',
    subject: 'Nova mensagem do portfólio',
    text: `Mensagem de: ${email}\n\n${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Erro ao enviar email');
    } else {
      console.log('Email enviado: ' + info.response);
      res.send('Mensagem enviada com sucesso!');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});