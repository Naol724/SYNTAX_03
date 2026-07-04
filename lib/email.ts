import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[]
  subject: string
  html: string
  text?: string
}) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn("Email credentials not configured. Skipping email send.")
      return { success: false, message: "Email not configured" }
    }

    const info = await transporter.sendMail({
      from: `"Syntax Software Solutions" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""),
    })

    console.log("Email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Email send error:", error)
    return { success: false, error: String(error) }
  }
}

export async function sendBookingNotification(booking: any) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Booking Request</h2>
      <p>You have received a new booking request from the website.</p>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> ${booking.name}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
        <p><strong>Phone:</strong> ${booking.phone}</p>
        <p><strong>Service:</strong> ${booking.service}</p>
        <p><strong>Preferred Date:</strong> ${new Date(booking.preferredDate).toLocaleDateString()}</p>
        <p><strong>Preferred Time:</strong> ${booking.preferredTime}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${booking.message || "No message provided"}</p>
      </div>
      <p>Please log in to the admin panel to manage this booking.</p>
    </div>
  `

  return sendEmail({
    to: process.env.ADMIN_EMAIL || "syntaxsoftwaresolution@gmail.com",
    subject: `New Booking Request - ${booking.name}`,
    html,
  })
}

export async function sendLeadNotification(lead: any) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Lead</h2>
      <p>You have received a new lead from the website.</p>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Phone:</strong> ${lead.phone || "Not provided"}</p>
        <p><strong>Company:</strong> ${lead.company || "Not provided"}</p>
        <p><strong>Interest:</strong> ${lead.interest}</p>
        <p><strong>Source:</strong> ${lead.source || "Website"}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${lead.message || "No message provided"}</p>
      </div>
      <p>Please log in to the admin panel to manage this lead.</p>
    </div>
  `

  return sendEmail({
    to: process.env.ADMIN_EMAIL || "syntaxsoftwaresolution@gmail.com",
    subject: `New Lead - ${lead.name}`,
    html,
  })
}

export async function sendContactNotification(contact: any) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Contact Message</h2>
      <p>You have received a new contact message from the website.</p>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Subject:</strong> ${contact.subject}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${contact.message}</p>
      </div>
      <p>Please respond to this inquiry as soon as possible.</p>
    </div>
  `

  return sendEmail({
    to: process.env.ADMIN_EMAIL || "syntaxsoftwaresolution@gmail.com",
    subject: `New Contact Message - ${contact.name}`,
    html,
  })
}

export async function sendCommentNotification(comment: any, postTitle: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Blog Comment</h2>
      <p>A new comment has been posted on your blog.</p>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Post:</strong> ${postTitle}</p>
        <p><strong>Name:</strong> ${comment.name}</p>
        <p><strong>Email:</strong> ${comment.email}</p>
        <p><strong>Comment:</strong></p>
        <p style="white-space: pre-wrap;">${comment.content}</p>
      </div>
      <p>Please review and approve this comment if appropriate.</p>
    </div>
  `

  return sendEmail({
    to: process.env.ADMIN_EMAIL || "syntaxsoftwaresolution@gmail.com",
    subject: `New Comment on "${postTitle}"`,
    html,
  })
}
