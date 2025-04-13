import transporter from '../config/emailConfig.js';

export const sendBookingEmails = async (req, res) => {
  const { userEmail, ownerEmail, bookingDetails } = req.body;
  const { venue, date, time } = bookingDetails;

  // Define subjects
  const userSubject = '✅ Booking Confirmation';
  const ownerSubject = '📢 New Booking Alert';

  // Define user email HTML
  const userHTML = `
    <h2 style="color: #4CAF50;">${userSubject}</h2>
    <p>Hello!</p>
    <p>Your booking at <strong>${venue}</strong> has been successfully confirmed.</p>
    <table style="border-collapse: collapse; margin-top: 10px;">
      <tr><td><strong>Date:</strong></td><td>${date}</td></tr>
      <tr><td><strong>Time:</strong></td><td>${time}</td></tr>
      <tr><td><strong>Venue:</strong></td><td>${venue}</td></tr>
    </table>
    <p style="margin-top: 15px;">Thanks for booking with us!</p>
  `;

  // Define owner email HTML
  const ownerHTML = `
    <h2 style="color: #2196F3;">${ownerSubject}</h2>
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
      subject: userSubject,
      html: userHTML
    });

    // Notify owner
    await transporter.sendMail({
      from: '"Booking Service" <no-reply@bookapp.com>',
      to: ownerEmail,
      subject: ownerSubject,
      html: ownerHTML
    });

    res.status(200).json({ message: 'Booking emails sent to user and owner' });
  } catch (err) {
    console.error('Booking email error:', err);
    res.status(500).json({ error: 'Email sending failed' });
  }
};


export const sendCancelledEmail = async (req, res) => {
  const { type, userEmail, ownerEmail, data } = req.body;

  try {
    let subject = '';
    let htmlContent = '';

    if (type === 'venue') {
      const { itemId, itemName, reason } = data;

      subject = '❌ Venue Booking Cancelled';
      htmlContent = `
        <h2 style="color: red;">❌ Venue Booking Cancelled</h2>
        <p>We regret to inform you that your booking for <strong>${itemName}</strong> (ID: ${itemId}) has been cancelled.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>Please contact support if you have any questions.</p>
      `;
    } else if (type === 'event') {
      const { eventId, eventName, eventDate, eventTime } = data;

      subject = '⚠️ Event Cancelled';
      htmlContent = `
        <h2 style="color: orange;">⚠️ Event Cancelled</h2>
        <p>The event <strong>${eventName}</strong> (ID: ${eventId}) has been cancelled.</p>
        <p><strong>Date:</strong> ${eventDate}</p>
        <p><strong>Time:</strong> ${eventTime}</p>
        <p>We apologize for the inconvenience.</p>
      `;
    } else {
      return res.status(400).json({ error: 'Invalid type provided' });
    }

    // Send email to user
    await transporter.sendMail({
      from: '"Notification" <no-reply@bookapp.com>',
      to: userEmail,
      subject,
      html: htmlContent
    });

    // Send email to owner
    await transporter.sendMail({
      from: '"Notification" <no-reply@bookapp.com>',
      to: ownerEmail,
      subject,
      html: htmlContent
    });

    res.status(200).json({ message: 'Cancellation emails sent' });
  } catch (err) {
    console.error('Cancellation email error:', err);
    res.status(500).json({ error: 'Failed to send cancellation emails' });
  }
};
