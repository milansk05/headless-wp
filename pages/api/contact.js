import nodemailer from 'nodemailer';

// Functie om contactform gegevens te valideren
const validateFormData = (data) => {
    const errors = [];

    if (!data.name || data.name.trim() === '') {
        errors.push('Naam is verplicht');
    }

    if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
        errors.push('Een geldig e-mailadres is verplicht');
    }

    if (!data.subject || data.subject.trim() === '') {
        errors.push('Onderwerp is verplicht');
    }

    if (!data.message || data.message.trim() === '') {
        errors.push('Bericht is verplicht');
    }

    return errors;
};

export default async function handler(req, res) {
    // Alleen POST requests afhandelen
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { name, email, subject, message } = req.body;

        // Valideer de formuliergegevens
        const validationErrors = validateFormData({ name, email, subject, message });
        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: 'Validatiefout: ' + validationErrors.join(', ')
            });
        }

        // Je kunt deze configuratie aanpassen met je eigen SMTP-provider
        // Voor Gmail, Outlook, etc. of een transactionele e-mailservice zoals SendGrid of Mailgun
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: (process.env.SMTP_SECURE || 'false') === 'true',
            auth: {
                user: process.env.SMTP_USER || 'jouw@gmail.com', // Je e-mailadres
                pass: process.env.SMTP_PASSWORD || 'jouw-app-wachtwoord', // Je wachtwoord of app-wachtwoord
            },
        });

        // E-mail adres waar de berichten naartoe moeten
        const toEmail = process.env.CONTACT_EMAIL || 'jouw@emailadres.nl';

        // E-mail content opbouwen
        const mailOptions = {
            from: `"${name}" <${email}>`, // Afzender wordt gezet op naam/e-mail van de persoon die het contactformulier invult
            to: toEmail, // Je eigen e-mailadres
            replyTo: email, // Antwoorden gaan direct naar de afzender
            subject: `Nieuw contactbericht: ${subject}`,
            text: `Naam: ${name}\nE-mail: ${email}\nOnderwerp: ${subject}\n\nBericht:\n${message}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Nieuw contactformulier bericht</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 100px;">Naam:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">E-mail:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">
                <a href="mailto:${email}" style="color: #0066cc; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Onderwerp:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${subject}</td>
            </tr>
          </table>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #333;">Bericht:</h3>
            <div style="white-space: pre-wrap;">${message.replace(/\n/g, '<br/>')}</div>
          </div>
          
          <p style="color: #777; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
            Dit bericht is verzonden via het contactformulier op je website.
          </p>
        </div>
      `,
        };

        // E-mail verzenden
        const info = await transporter.sendMail(mailOptions);

        console.log('Message sent: %s', info.messageId);

        return res.status(200).json({
            message: 'Je bericht is succesvol verzonden. Bedankt voor je contact!'
        });

    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
            message: 'Er is iets misgegaan bij het verzenden van je bericht. Probeer het later opnieuw.'
        });
    }
}