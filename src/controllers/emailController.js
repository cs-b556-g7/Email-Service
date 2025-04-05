import transporter from '../config/emailConfig.js';

export const sendBookingEmails = async (req, res) => {
  const { userEmail, ownerEmail, bookingDetails } = req.body;
  const { venue, date, time } = bookingDetails;

  const userHTML = `
    <h2 style="color: #4CAF50;">✅ Booking Confirmed</h2>
    <p>Hello!</p>
    <p>Your booking at <strong>${venue}</strong> has been successfully confirmed.</p>
    <table style="border-collapse: collapse; margin-top: 10px;">
      <tr><td><strong>Date:</strong></td><td>${date}</td></tr>
      <tr><td><strong>Time:</strong></td><td>${time}</td></tr>
      <tr><td><strong>Venue:</strong></td><td>${venue}</td></tr>
    </table>
    <p style="margin-top: 15px;">Thanks for booking with us!</p>
  `;

  const ownerHTML = `
    <h2 style="color: #2196F3;">📢 New Booking Alert</h2>
    <p>You received a new booking!</p>
    <table style="border-collapse: collapse; margin-top: 10px;">
      <tr><td><strong>Date:</strong></td><td>${date}</td></tr>
      <tr><td><strong>Time:</strong></td><td>${time}</td></tr>
      <tr><td><strong>Venue:</strong></td><td>${venue}</td></tr>
    </table>
    <p style="margin-top: 15px;">Please prepare accordingly.</p>
  `;

  try {
    // Send confirmation to user
    await transporter.sendMail({
      from: '"Booking Service" <no-reply@bookapp.com>',
      to: userEmail,
      subject: '✅ Booking Confirmation',
      html: userHTML
    });

    // Notify owner
    await transporter.sendMail({
      from: '"Booking Service" <no-reply@bookapp.com>',
      to: ownerEmail,
      subject: '📢 New Booking Alert',
      html: ownerHTML
    });

    res.status(200).json({ message: 'HTML emails sent to user and owner' });
  } catch (err) {
    console.error('HTML email error:', err);
    res.status(500).json({ error: 'Email sending failed' });
  }
};
