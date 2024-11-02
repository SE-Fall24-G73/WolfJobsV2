const nodemailer = require("nodemailer");
const {
  jobApplicationAcceptedTemplate,
} = require("../emails/jobApplicationAcceptedTemplate");
const {
  jobApplicationRejectionTemplate,
} = require("../emails/jobApplicationRejectionTemplate");
const { jobSelectionTemplate } = require("../emails/jobSelectionTemplate");
const User = require("../models/user");
const crypto = require("crypto");
var bcrypt = require("bcryptjs");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

module.exports.sendJobAcceptanceEmail = async (req, res) => {
  const {
    applicationId,
    jobid,
    emailType,
    applicantEmail,
    applicantName,
    jobTitle,
    companyName,
    contactEmail,
  } = req.body;

  console.log(
    applicationId,
    jobid,
    emailType,
    applicantEmail,
    applicantName,
    jobTitle,
    companyName,
    contactEmail
  );

  const emailHtml = jobApplicationAcceptedTemplate({
    applicantName: applicantName,
    jobTitle: jobTitle,
    companyName: companyName,
    contactEmail: contactEmail,
    applicationDate: new Date().toLocaleDateString(),
    nextSteps:
      "Please log in to your account to complete a brief assessment quiz. This will help us move forward in the hiring process.",
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL, // sender address
      to: applicantEmail, // list of receivers
      subject: `Your Application for ${jobTitle} has been Accepted`, // Subject line
      html: emailHtml, // html body
    });

    console.log("Message sent: %s", info.messageId);
    return res.status(201).json({
      success: true,
      message: "Application accepted and email sent.",
      data: info,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.sendJobRejectionEmail = async (req, res) => {
  const { applicantEmail, applicantName, jobTitle, companyName, contactEmail } =
    req.body;

  // Generate the email HTML content
  const emailHtml = jobApplicationRejectionTemplate({
    applicantName: applicantName,
    jobTitle: jobTitle,
    companyName: companyName,
    contactEmail: contactEmail,
    applicationDate: new Date().toLocaleDateString(),
  });

  try {
    // Send the email using Resend SDK
    const info = await transporter.sendMail({
      from: process.env.EMAIL, // sender address
      to: applicantEmail, // list of receivers
      subject: `Update on your application for ${jobTitle}`,
      html: emailHtml, // html body
    });

    console.log("Message sent: %s", info.messageId);

    res
      .status(200)
      .json({ success: true, data: info, messageId: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.sendJobSelectionEmail = async (req, res) => {
  const { applicantEmail, applicantName, jobTitle, companyName, contactEmail } =
    req.body;

  const today = new Date();
  const startDateObj = new Date();
  startDateObj.setDate(today.getDate() + 7);

  // Format the date as desired (e.g., 'November 1, 2024')
  const options = { year: "numeric", month: "long", day: "numeric" };
  const startDate = startDateObj.toLocaleDateString("en-US", options);

  // Define the onboarding details with the dynamic start date
  const onboardingDetails = `
    <p>We're excited to have you on board! Here are the next steps to get you started:</p>

    <ul>
      <li><strong>Start Date</strong>: ${startDate}</li>
      <li><strong>Time</strong>: Please arrive by 9:00 AM</li>
   
    </ul>

    <p><strong>Please bring the following documents:</strong></p>

    <ul>
      <li>A valid government-issued photo ID</li>
      <li>Completed tax and employment eligibility forms (attached to this email)</li>
      <li>Direct deposit information</li>
    </ul>

    <p><strong>Orientation Schedule:</strong></p>

    <p>On your first day, you'll attend a brief orientation session to introduce you to our company culture, policies, and your new team.</p>

    <p>If you have any questions before your start date, feel free to reach out to our HR department at ${contactEmail}.</p>

    <p>We look forward to working with you!</p>
  `;
  // Generate the email HTML content
  const emailHtml = jobSelectionTemplate({
    applicantName: applicantName,
    jobTitle: jobTitle,
    companyName: companyName,
    contactEmail: contactEmail,
    onboardingDetails: onboardingDetails,
  });

  try {
    // Send the email using Nodemailer transporter
    const info = await transporter.sendMail({
      from: process.env.EMAIL, // Sender address (must match SMTP user)
      to: applicantEmail, // Recipient email address
      subject: `Congratulations! You're hired for ${jobTitle}`, // Email subject
      html: emailHtml, // Email body (HTML)
    });

    console.log("Message sent: %s", info.messageId);

    res.status(201).json({
      success: true,
      message: "Job selection email sent.",
      data: info,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.resetPassword = async (req, res) => {
  const token = req.body.token;

  // console.log(token);

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const expire = Date.now() + 15 * 60 * 1000;

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid Token",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user.password = hashedPassword;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset Successfully",
  });
};
