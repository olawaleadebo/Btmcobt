const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Configuration Error:', error);
  } else {
    console.log('✅ SMTP Server ready to send emails');
  }
});

// Send booking confirmation email
exports.sendBookingConfirmation = async (booking, user) => {
  try {
    const bookingType = booking.constructor.modelName.toLowerCase();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: `Booking Confirmation - ${booking.bookingReference}`,
      html: generateBookingConfirmationHTML(booking, user, bookingType),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Booking confirmation email sent:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    throw new Error(`Failed to send booking confirmation: ${error.message}`);
  }
};

// Send payment receipt email
exports.sendPaymentReceipt = async (payment, user, booking) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: `Payment Receipt - ${payment.paystackReference}`,
      html: generatePaymentReceiptHTML(payment, user, booking),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Payment receipt email sent:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    throw new Error(`Failed to send payment receipt: ${error.message}`);
  }
};

// Send booking cancellation email
exports.sendCancellationEmail = async (booking, user) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: `Booking Cancelled - ${booking.bookingReference}`,
      html: generateCancellationHTML(booking, user),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Cancellation email sent:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    throw new Error(`Failed to send cancellation email: ${error.message}`);
  }
};

// Send booking reminder email
exports.sendBookingReminder = async (booking, user) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: `Booking Reminder - ${booking.bookingReference}`,
      html: generateReminderHTML(booking, user),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Reminder email sent:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    throw new Error(`Failed to send reminder email: ${error.message}`);
  }
};

// HTML email templates

function generateBookingConfirmationHTML(booking, user, bookingType) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .label { font-weight: bold; color: #6b7280; }
        .value { color: #111827; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Booking Confirmed!</h1>
          <p>Thank you for booking with COBT</p>
        </div>
        
        <div class="content">
          <p>Dear ${user.name},</p>
          <p>Your ${bookingType} booking has been confirmed. Here are your booking details:</p>
          
          <div class="booking-details">
            <div class="detail-row">
              <span class="label">Booking Reference:</span>
              <span class="value">${booking.bookingReference}</span>
            </div>
            <div class="detail-row">
              <span class="label">Status:</span>
              <span class="value">${booking.status.toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <span class="label">Total Amount:</span>
              <span class="value">${booking.currency} ${booking.price.toFixed(2)}</span>
            </div>
            <div class="detail-row">
              <span class="label">Booking Date:</span>
              <span class="value">${new Date(booking.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <p>We've sent this confirmation to your email. Please save this email for your records.</p>
          
          <center>
            <a href="${process.env.FRONTEND_URL}/bookings" class="button">View My Bookings</a>
          </center>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Corporate Booking Tool. All rights reserved.</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generatePaymentReceiptHTML(payment, user, booking) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; }
        .receipt { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .total-row { font-size: 18px; font-weight: bold; padding-top: 15px; border-top: 2px solid #10b981; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💳 Payment Successful!</h1>
          <p>Payment Receipt</p>
        </div>
        
        <div class="content">
          <p>Dear ${user.name},</p>
          <p>Your payment has been processed successfully. Here are the details:</p>
          
          <div class="receipt">
            <div class="detail-row">
              <span>Payment Reference:</span>
              <span>${payment.paystackReference}</span>
            </div>
            <div class="detail-row">
              <span>Booking Reference:</span>
              <span>${booking?.bookingReference || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span>Payment Method:</span>
              <span>${payment.paymentMethod || 'Card'}</span>
            </div>
            <div class="detail-row">
              <span>Payment Date:</span>
              <span>${new Date(payment.createdAt).toLocaleString()}</span>
            </div>
            <div class="detail-row total-row">
              <span>Total Paid:</span>
              <span>${payment.currency} ${payment.amount.toFixed(2)}</span>
            </div>
          </div>
          
          <p>Thank you for your payment. This receipt has been sent to your email for your records.</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Corporate Booking Tool. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateCancellationHTML(booking, user) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Booking Cancelled</h2>
        <p>Dear ${user.name},</p>
        <p>Your booking (${booking.bookingReference}) has been cancelled.</p>
        <p>If you did not request this cancellation, please contact us immediately.</p>
      </div>
    </body>
    </html>
  `;
}

function generateReminderHTML(booking, user) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Booking Reminder</h2>
        <p>Dear ${user.name},</p>
        <p>This is a reminder about your upcoming booking (${booking.bookingReference}).</p>
        <p>Please ensure you have all necessary documents and arrive on time.</p>
      </div>
    </body>
    </html>
  `;
}

module.exports = exports;
