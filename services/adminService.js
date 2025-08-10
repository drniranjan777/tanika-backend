const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class AdminService {
  constructor(
    adminRepository,
    validator,
    mailer,
    templateEngine,
    jwtSecret,
    uiServer
  ) {
    this.adminRepository = adminRepository;
    this.validator = validator;
    this.mailer = mailer;
    this.templateEngine = templateEngine;
    this.jwtSecret = jwtSecret;
    this.uiServer = uiServer;
  }

  async changePassword(request, userId) {
    // Validate request here as needed

    const result = await this.adminRepository.getUserAndPasswordByID(userId);
    if (!result) throw new Error("Invalid user");

    const passwordMatch = await bcrypt.compare(
      request.currentPassword,
      result.password
    );
    if (!passwordMatch) throw new Error("Invalid Password.");

    const hashedPass = await bcrypt.hash(request.password, 10);
    const updated = await this.adminRepository.updatePassword(
      hashedPass,
      userId
    );
    return { status: updated > 0 };
  }

  async logOutUser(id) {
    await this.adminRepository.clearExpiredTokens();
    const cleared = await this.adminRepository.clearTokenForAUserID(id);
    return { status: cleared > 0 };
  }

  async validateForgotPwdToken(tokenId) {
    const user = await this.adminRepository.getUserByForgotPasswordToken(
      tokenId
    );
    return { status: !!user };
  }

  async verifyAndChangePassword(request) {
    const record = await this.adminRepository.getUserByForgotPasswordToken(
      request.tokenID
    );
    if (!record) throw new Error("This link is no longer valid");

    const [createdDate, user] = record; // depends on repo return shape
    const diffMinutes =
      (Date.now() - new Date(createdDate).getTime()) / (60 * 1000);
    if (diffMinutes > 50) throw new Error("This link is no longer valid");

    const hashed = await bcrypt.hash(request.password, 10);
    const status = await this.adminRepository.updatePassword(hashed, user.id);
    await this.adminRepository.clearExpiredForgotTokens(user.id);

    return { status };
  }

  async forgotPassword(request) {
    // Validate request

    const user = await this.adminRepository.getUserByUserName(request.username);
    if (!user || !user.active)
      throw new Error("Invalid username or inactive account");

    await this.adminRepository.clearExpiredForgotTokens(user.id);
    const token = await this.adminRepository.createForgotPasswordToken(user.id);
    const link = `${this.uiServer}/resetPassword/${token}`;

    const body = await this.templateEngine.renderToHTMLStr("forgot.ftl", {
      link,
      userName: user.username,
    });
    await this.mailer.sendMail(user.email, "Reset Password", body, true);

    return { status: true };
  }

  generateRandomString(length = 8) {
    return crypto.randomBytes(length).toString("base64").slice(0, length);
  }

  async registerUser(request, htmlTemplate) {
    // Validate request

    const exists = await this.adminRepository.isUsernameUnique(
      request.username,
      request.email
    );
    if (exists) throw new Error("Username/email not unique");

    const generatedPassword = this.generateRandomString(8);
    const hashed = await bcrypt.hash(generatedPassword, 10);

    const userId = await this.adminRepository.insertUser({
      userName: request.username,
      password: hashed,
      email: request.email,
      isActive: request.isActive,
    });

    const user = await this.adminRepository.getUserByID(userId);
    if (!user) throw new Error("Registration failed");

    const body = htmlTemplate(generatedPassword, user.userName);
    await this.mailer.sendMail(user.email, "BFP Account Created.", body, true);

    return user;
  }

  async loginUser(request) {
    const result = await this.adminRepository.getUserAndPasswordByUserName(
      request.username
    );
    if (!result) throw new Error("Login failed");

    const passwordMatch = await bcrypt.compare(
      request.password,
      result.password
    );
    if (!passwordMatch) throw new Error("Login failed");

    const user = result.user;
    if (!user.active)
      throw new Error(
        "Your account doesn't allow login. Please contact admin."
      );

    await this.adminRepository.clearExpiredTokens();

    const uniqueToken = generateUUID(); // You can use 'uuid' npm package or similar
    await this.adminRepository.insertUserAuthToken(user.id, uniqueToken);

    const jwtToken = jwt.sign(
      {
        userName: user.userName,
        userID: user.id,
        token: uniqueToken,
        loginType: "ADMIN",
      },
      this.jwtSecret,
      { expiresIn: "60h" }
    );

    return { jwtToken, user };
  }

  async authorizeRequest(uniqueToken, userID) {
    const user = await this.adminRepository.getUserByTokenAndID(
      userID,
      uniqueToken
    );
    return !!user;
  }
}

module.exports = AdminService;
