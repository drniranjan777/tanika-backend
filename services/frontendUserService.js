const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const UserModel = require("../models/frontendUser");
const UserRepository = require("../repositories/frontendUserRepository");
const { sendEmail } = require("../utils/mailer");


const JWT_SECRET = process.env.JWT_SECRET;

class UserService {
  constructor() {
    this.repository = new UserRepository(UserModel);
  }

  async registerUser(userData) {
    const existing = await this.repository.findByEmail(userData.gmail);
    if (existing) {

      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await this.repository.createUser({
      name: userData.name,
      number: userData.number,
      gmail: userData.gmail,
      password: hashedPassword,
    });

    return { id: newUser.id, name: newUser.name, gmail: newUser.gmail };
  }

  async loginUser({ gmail, password }) {
    const user = await this.repository.findByEmail(gmail);
    if (!user) throw new Error("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
   
    if (!isMatch) throw new Error("Invalid email or password");


    const token = jwt.sign({ id: user.id, gmail: user.gmail }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return { token, user: { id: user.id, name: user.name, gmail: user.gmail } };
  }

  async forgotPassword(email) {
    const user = await this.repository.findByEmail(email);
    if (!user) throw new Error("User not found");

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.repository.setResetToken(email, token, expiry);

    // const resetLink = `https://your-frontend.com/reset-password?token=${token}`;
    
    // // Replace with actual email service
    // console.log(`🔗 Reset Link: ${resetLink}`);

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    const subject = "Reset Your Password || Tanika Design ";
    const html = `
      <p>Hello </p>
      <p>You requested to reset your password.</p>
      <p><a href="${resetLink}">Click here to reset your password</a></p>
      <p>This link will expire in 1 hour.</p>
      <br />
      <p>If you didn't request this, please ignore this email.</p>
    `;

     await sendEmail(email, subject, html);

    return { message: "Password reset link has been sent to your email." };
  }

  async resetPassword(token, newPassword) {
    const user = await this.repository.findByResetToken(token);
    if (!user) throw new Error("Invalid or expired token");

    const hashed = await bcrypt.hash(newPassword, 10);
    const success = await this.repository.updatePassword(user.id, hashed);

    if (!success) throw new Error("Failed to reset password");

    return { message: "Password has been successfully reset." };
  }

  async getUserById(id) {
    return await this.repository.findById(id);
  }
}

module.exports = new UserService();
