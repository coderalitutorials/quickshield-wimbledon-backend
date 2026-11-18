












import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://quickshield-wimbledon-frontend.vercel.app",
  "https://pestcontrolwimbledon.uk",
  "https://www.pestcontrolwimbledon.uk",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("QuickShield Services wimbledon Backend is active.");
});

const BRAND_NAME = "QuickShield Services wimbledon";
const BRAND_LOCATION = "wimbledon, London";
const BRAND_PHONE = "+447459860336";
const BRAND_EMAIL = "info@quickshieldpestcontrol.uk";

const QUICKSHIELD_NAVY = "#0A2240";
const QUICKSHIELD_GOLD = "#b99547";
const QUICKSHIELD_BG = "#F8F4E8";

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, postcode, service, message } = req.body;

    if (!name || !email || !phone || !postcode || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${BRAND_NAME}" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      replyTo: email,
      subject: `[New Lead] ${BRAND_NAME} - ${service || "General Inquiry"}`,
      html: `
        <body style="font-family: Arial, sans-serif; background-color: ${QUICKSHIELD_BG}; padding: 20px; margin: 0;">
          <div style="max-width: 620px; margin: auto; background: #ffffff; border-top: 6px solid ${QUICKSHIELD_NAVY}; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(10,34,64,0.12);">
            
            <div style="background-color:${QUICKSHIELD_NAVY}; padding: 28px 24px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:22px; text-transform:uppercase; letter-spacing:0.08em;">
                New Service Request
              </h1>
              <p style="margin:8px 0 0; color:${QUICKSHIELD_GOLD}; font-size:13px; font-weight:bold;">
                ${BRAND_NAME} • ${BRAND_LOCATION}
              </p>
            </div>

            <div style="padding: 28px;">
              <p style="color:#64748b; font-size:14px; margin-bottom:22px;">
                A new pest control enquiry has been submitted from the website.
              </p>

              <div style="background:#f8fafc; border-left:4px solid ${QUICKSHIELD_GOLD}; padding:14px 16px; margin-bottom:12px;">
                <strong style="color:${QUICKSHIELD_NAVY};">Name:</strong> ${name}
              </div>

              <div style="background:#f8fafc; border-left:4px solid ${QUICKSHIELD_GOLD}; padding:14px 16px; margin-bottom:12px;">
                <strong style="color:${QUICKSHIELD_NAVY};">Email:</strong> <a href="mailto:${email}" style="color:${QUICKSHIELD_NAVY};">${email}</a>
              </div>

              <div style="background:#f8fafc; border-left:4px solid ${QUICKSHIELD_GOLD}; padding:14px 16px; margin-bottom:12px;">
                <strong style="color:${QUICKSHIELD_NAVY};">Phone:</strong> <a href="tel:${phone}" style="color:${QUICKSHIELD_NAVY};">${phone}</a>
              </div>

              <div style="background:#f8fafc; border-left:4px solid ${QUICKSHIELD_GOLD}; padding:14px 16px; margin-bottom:12px;">
                <strong style="color:${QUICKSHIELD_NAVY};">Postcode:</strong> ${postcode}
              </div>

              <div style="background:#f8fafc; border-left:4px solid ${QUICKSHIELD_GOLD}; padding:14px 16px; margin-bottom:12px;">
                <strong style="color:${QUICKSHIELD_NAVY};">Service:</strong> ${service || "General Inquiry"}
              </div>

              <div style="background:#fff7ed; border:1px solid rgba(185,149,71,0.25); padding:18px; border-radius:10px; margin-top:20px;">
                <strong style="color:${QUICKSHIELD_NAVY};">Message:</strong>
                <p style="margin:10px 0 0; color:#334155; line-height:1.6;">${message}</p>
              </div>

              <div style="margin-top:28px; padding:16px; background:${QUICKSHIELD_NAVY}; border-radius:10px; text-align:center;">
                <p style="margin:0; color:#ffffff; font-size:12px; letter-spacing:0.08em; text-transform:uppercase;">
                  QuickShield Lead Notification
                </p>
                <p style="margin:6px 0 0; color:${QUICKSHIELD_GOLD}; font-size:13px;">
                  ${BRAND_PHONE} • ${BRAND_EMAIL}
                </p>
              </div>
            </div>
          </div>
        </body>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Lead sent successfully.",
    });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send contact request.",
    });
  }
});

app.post("/api/callback", async (req, res) => {
  try {
    const { name, postcode, phone } = req.body;

    if (!name || !postcode || !phone) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${BRAND_NAME} Callback" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `[Callback Request] ${BRAND_NAME} - ${name}`,
      html: `
        <body style="margin:0; padding:40px 10px; background-color:${QUICKSHIELD_BG}; font-family: Arial, sans-serif;">
          <div style="max-width:560px; margin:0 auto; background-color:#ffffff; border-radius:16px; overflow:hidden; border:1px solid rgba(10,34,64,0.12); box-shadow: 0 10px 25px rgba(10,34,64,0.12);">
            
            <div style="background-color:${QUICKSHIELD_NAVY}; padding:30px 24px; text-align:center;">
              <h1 style="margin:0; font-size:21px; color:#ffffff; text-transform:uppercase; letter-spacing:0.1em;">
                Callback Request
              </h1>
              <p style="margin:8px 0 0; color:${QUICKSHIELD_GOLD}; font-size:13px; font-weight:bold;">
                ${BRAND_NAME} • ${BRAND_LOCATION}
              </p>
            </div>

            <div style="padding:30px 25px;">
              <p style="color:#64748b; font-size:14px; margin-bottom:25px;">
                A visitor has requested a quick callback from the website.
              </p>

              <div style="background-color:#f8fafc; padding:14px 16px; margin-bottom:12px; border-radius:8px; border-left:4px solid ${QUICKSHIELD_GOLD};">
                <strong style="color:${QUICKSHIELD_NAVY};">Name:</strong>
                <span style="float:right; color:${QUICKSHIELD_NAVY}; font-weight:700;">${name}</span>
              </div>

              <div style="background-color:#f8fafc; padding:14px 16px; margin-bottom:12px; border-radius:8px; border-left:4px solid ${QUICKSHIELD_GOLD};">
                <strong style="color:${QUICKSHIELD_NAVY};">Postcode:</strong>
                <span style="float:right; color:${QUICKSHIELD_NAVY}; font-weight:700;">${postcode}</span>
              </div>

              <div style="background-color:#f8fafc; padding:14px 16px; margin-bottom:12px; border-radius:8px; border-left:4px solid ${QUICKSHIELD_GOLD};">
                <strong style="color:${QUICKSHIELD_NAVY};">Phone:</strong>
                <span style="float:right;">
                  <a href="tel:${phone}" style="color:${QUICKSHIELD_NAVY}; font-weight:bold; text-decoration:none;">${phone}</a>
                </span>
              </div>

              <div style="margin-top:28px; padding:16px; background:${QUICKSHIELD_NAVY}; border-radius:10px; text-align:center;">
                <p style="margin:0; color:#ffffff; font-size:12px; text-transform:uppercase; letter-spacing:0.08em;">
                  QuickShield Callback Notification
                </p>
                <p style="margin:6px 0 0; color:${QUICKSHIELD_GOLD}; font-size:13px;">
                  ${BRAND_PHONE} • ${BRAND_EMAIL}
                </p>
              </div>
            </div>

            <div style="padding:15px; background-color:#f1f5f9; text-align:center; font-size:10px; color:#64748b;">
              Automated Website Routing // ${BRAND_NAME}
            </div>
          </div>
        </body>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Callback request sent.",
    });
  } catch (error) {
    console.error("Callback Error:", error);
    res.status(500).json({
      success: false,
      message: "Callback failed.",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`${BRAND_NAME} server running on port ${PORT}`)
);

export default app;