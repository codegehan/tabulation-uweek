// app/api/email/route.js
import nodemailer from 'nodemailer';

export async function POST(req) {
  const { email, message } = await req.json();

  if (!email || !message) {
    return new Response(
      JSON.stringify({ error: 'All fields are required' }),
      { status: 400 }
    );
  }

  // Updated transporter configuration
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_PASSWORD,
    to: email,
    subject: `JRMSU TABULATION OTP CODE`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #172554;">
        <div style="background-color: #1e40af; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <h2 style="color: #ffffff; text-align: center; margin-bottom: 20px; font-size: 24px;">One-Time Password (OTP)</h2>
          <p style="color: #ffffff; line-height: 1.6; opacity: 0.9;">
            Dear User,
          </p>
          <p style="color: #ffffff; line-height: 1.6; opacity: 0.9;">
            You have requested access to the JRMSU Tabulation System. Please use the following One-Time Password (OTP) to complete your login:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="background-color: #ffffff; color: #1e40af; padding: 10px 20px; border-radius: 5px; font-size: 24px; letter-spacing: 2px; font-weight: bold;">
              ${message}
            </span>
          </div>
          <p style="color: #ffffff; line-height: 1.6; opacity: 0.9;">
            <strong style="color: #ffffff;">Important:</strong>
            <br>
            - This OTP is valid for a limited time
            <br>
            - Do not share this code with anyone
            <br>
            - This is an automated message. Please do not reply
          </p>
          <p style="color: #ffffff; font-size: 12px; text-align: center; margin-top: 20px; opacity: 0.7;">
            © ${new Date().getFullYear()} JRMSU Tabulation System
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response(
      JSON.stringify({ success: 'Email sent successfully!' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Detailed error sending email:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email', 
        details: error.message 
      }),
      { status: 500 }
    );
  }
}