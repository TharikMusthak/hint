const transporter = require("../config/mail");

const sendContactMail = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      service,
      message,
    } = req.body;

    console.log("📩 Request Body:", req.body);

    // Service array-a handle panna (oruvela string aavo illa empty aavo vantha error varama irukka)
    const formattedServices = Array.isArray(service) ? service.join(", ") : service || "Not specified";

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: `New Enquiry From ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f7f6; padding: 20px; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
            
            <!-- Header Section -->
            <div style="background-color: #0046c0; color: #ffffff; padding: 20px; text-align: center;">
              <h2 style="margin: 0; font-size: 24px;">New Website Enquiry</h2>
              <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">You have received a new message</p>
            </div>

            <!-- Body Section -->
            <div style="padding: 25px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hello Admin, here are the details of the new enquiry:</p>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; width: 30%; font-weight: bold; color: #555;">Name</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${name || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555;">Email</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">
                    <a href="mailto:${email}" style="color: #0046c0; text-decoration: none;">${email || 'N/A'}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555;">Phone</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">
                    <a href="tel:${phone}" style="color: #0046c0; text-decoration: none;">${phone || 'N/A'}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555;">Services</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${formattedServices}</td>
                </tr>
              </table>

              <!-- Message Box -->
              <div style="margin-top: 25px;">
                <h4 style="margin: 0 0 10px; color: #555;">Message / Remarks:</h4>
                <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0046c0; border-radius: 4px; font-style: italic; color: #444;">
                  ${message ? message.replace(/\n/g, "<br>") : 'No message provided.'}
                </div>
              </div>
            </div>

            <!-- Footer Section -->
            <div style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 12px; color: #777;">
              <p style="margin: 0;">This email was generated from your website contact form.</p>
            </div>
            
          </div>
        </div>
      `,
    });

    console.log("✅ Mail Sent Successfully");
    console.log(info.messageId);

    res.status(200).json({
      success: true,
      message: "Mail sent successfully 🚀",
    });

  } catch (error) {
    console.error("❌ Mail Error:", error);

    res.status(500).json({
      success: false,
      message: "Mail sending failed",
      error: error.message,
    });
  }
};

module.exports = {
  sendContactMail,
};