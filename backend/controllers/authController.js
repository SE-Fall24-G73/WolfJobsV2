const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user");

module.exports.googleLogin = async function (req, res) {
  const { token } = req.body;

  try {
    if (!token) {
      return res.status(400).json({
        message: "Token is required",
      });
    }

    // Verify the token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({
        message: "Invalid token payload",
      });
    }

    // Extract user information from payload
    const { email, name, sub: googleId, picture: avatar } = payload;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // If user exists but doesn't have a Google ID, link it
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = avatar;
        await user.save();
      }
    } else {
      // Create a new user
      user = await User.create({
        email,
        name,
        password: crypto.randomBytes(20).toString("hex"), // Assign a random password
        role: "Applicant", // Default role; adjust as needed
        isVerified: true, // Since Google verifies email
        googleId,
        avatar,
      });
    }

    // Generate JWT
    const tokenJWT = jwt.sign(
      user.toJSON(),
      process.env.JWT_SECRET || "wolfjobs",
      {
        expiresIn: "100000",
      }
    );

    return res.status(200).json({
      message: "Google Sign-In Successful",
      data: {
        token: tokenJWT,
        user,
      },
      success: true,
    });
  } catch (error) {
    console.error("Google Login Error:", error); // Enhanced logging
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
