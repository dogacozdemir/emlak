/**
 * Email Service
 * Placeholder for email notifications using Resend or SMTP
 */

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email (placeholder - implement with Resend or SMTP)
 */
export async function sendEmail(data: EmailData): Promise<void> {
  // TODO: Implement with Resend API or SMTP
  // For now, just log the email
  console.log('📧 Email would be sent:', {
    to: data.to,
    subject: data.subject,
    // html: data.html, // Don't log full HTML
  });

  // Placeholder implementation
  if (process.env.RESEND_API_KEY) {
    // Future: Use Resend API
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'noreply@emlak.com',
    //   to: data.to,
    //   subject: data.subject,
    //   html: data.html,
    // });
  } else if (process.env.SMTP_HOST) {
    // Future: Use SMTP
    // const transporter = nodemailer.createTransport({...});
    // await transporter.sendMail({...});
  }
}

/**
 * Send booking confirmation email to user
 */
export async function sendBookingConfirmationEmail(
  userEmail: string,
  userName: string,
  propertyTitle: string,
  bookingDate: Date
): Promise<void> {
  const formattedDate = new Date(bookingDate).toLocaleString('tr-TR', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  await sendEmail({
    to: userEmail,
    subject: `Viewing Appointment Request - ${propertyTitle}`,
    html: `
      <h2>Viewing Appointment Request</h2>
      <p>Hello ${userName},</p>
      <p>Your viewing appointment request has been received:</p>
      <ul>
        <li><strong>Property:</strong> ${propertyTitle}</li>
        <li><strong>Date & Time:</strong> ${formattedDate}</li>
        <li><strong>Status:</strong> Pending Approval</li>
      </ul>
      <p>You will receive another email once your appointment is approved by the property agent.</p>
      <p>Best regards,<br>KKTC Emlak Team</p>
    `,
    text: `Viewing Appointment Request\n\nHello ${userName},\n\nYour viewing appointment request has been received:\n\nProperty: ${propertyTitle}\nDate & Time: ${formattedDate}\nStatus: Pending Approval\n\nYou will receive another email once your appointment is approved.`,
  });
}

/**
 * Send booking approval email to user
 */
export async function sendBookingApprovalEmail(
  userEmail: string,
  userName: string,
  propertyTitle: string,
  bookingDate: Date,
  adminNotes?: string
): Promise<void> {
  const formattedDate = new Date(bookingDate).toLocaleString('tr-TR', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  await sendEmail({
    to: userEmail,
    subject: `Viewing Appointment Approved - ${propertyTitle}`,
    html: `
      <h2>Viewing Appointment Approved</h2>
      <p>Hello ${userName},</p>
      <p>Great news! Your viewing appointment has been approved:</p>
      <ul>
        <li><strong>Property:</strong> ${propertyTitle}</li>
        <li><strong>Date & Time:</strong> ${formattedDate}</li>
        <li><strong>Status:</strong> Approved</li>
      </ul>
      ${adminNotes ? `<p><strong>Notes:</strong> ${adminNotes}</p>` : ''}
      <p>We look forward to seeing you!</p>
      <p>Best regards,<br>KKTC Emlak Team</p>
    `,
    text: `Viewing Appointment Approved\n\nHello ${userName},\n\nYour viewing appointment has been approved:\n\nProperty: ${propertyTitle}\nDate & Time: ${formattedDate}\nStatus: Approved\n\n${adminNotes ? `Notes: ${adminNotes}\n\n` : ''}We look forward to seeing you!`,
  });
}

/**
 * Send booking rejection email to user
 */
export async function sendBookingRejectionEmail(
  userEmail: string,
  userName: string,
  propertyTitle: string,
  bookingDate: Date,
  adminNotes?: string
): Promise<void> {
  const formattedDate = new Date(bookingDate).toLocaleString('tr-TR', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  await sendEmail({
    to: userEmail,
    subject: `Viewing Appointment Update - ${propertyTitle}`,
    html: `
      <h2>Viewing Appointment Update</h2>
      <p>Hello ${userName},</p>
      <p>Unfortunately, your viewing appointment could not be confirmed:</p>
      <ul>
        <li><strong>Property:</strong> ${propertyTitle}</li>
        <li><strong>Date & Time:</strong> ${formattedDate}</li>
        <li><strong>Status:</strong> Not Available</li>
      </ul>
      ${adminNotes ? `<p><strong>Reason:</strong> ${adminNotes}</p>` : ''}
      <p>Please feel free to request another time slot that works for you.</p>
      <p>Best regards,<br>KKTC Emlak Team</p>
    `,
    text: `Viewing Appointment Update\n\nHello ${userName},\n\nUnfortunately, your viewing appointment could not be confirmed:\n\nProperty: ${propertyTitle}\nDate & Time: ${formattedDate}\nStatus: Not Available\n\n${adminNotes ? `Reason: ${adminNotes}\n\n` : ''}Please feel free to request another time slot.`,
  });
}

