import VARIABLES from "../config/variables";
import ResetToken from "../database/models/ResetToken";
import UserInstitutions from "../database/models/UserInstitutions";
import UserModel from "../database/models/UserModel";
import {
  ChangeInstitution,
  IJWTPayload,
  ILogin,
  IRegister,
  IResetPassword,
  IResetPasswordRequest,
} from "../type";
import CustomError, { catchSequelizeError } from "../utils/CustomError";
import { compare, encrypt, generateResetToken } from "../utils/Password";
import sendEmail from "../utils/SendMail";
import { genToken } from "../utils/jwt";

class AuthService {
  public static async register(data: IRegister): Promise<IJWTPayload | null> {
    try {
      const password = await encrypt(data.password);
      const user = await UserModel.create({
        ...data,
        password,
      });
      if (!user || user == null) throw new CustomError("Creation failed");

      const tokenData = await this.login({
        email: data.email,
        password: data.password,
      });
      return {
        ...{ ...user.toJSON() },
        accessToken: tokenData.accessToken,
      };
    } catch (error) {
      catchSequelizeError({ item: "User", error });
      return null;
    }
  }

  public static async login(data: ILogin): Promise<IJWTPayload> {
    const user = await UserModel.findOne({
      where: { email: data.email },
    });
    if (user == null) throw new CustomError("Unknown credentials");

    const comparePasswords = compare(data.password, user.password);
    if (!comparePasswords) throw new CustomError("Unknown credentials");

    const token = await genToken({ email: data.email });
    return { user, accessToken: token };
  }

  public static async resetPasswordRequest(
    data: IResetPasswordRequest
  ): Promise<{ message: string }> {
    const { email } = data;
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    await ResetToken.destroy({ where: { userId: user.id } });
    const token = generateResetToken();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    await ResetToken.create({ userId: user.id, token, expiryDate });
    const resetLink = `${VARIABLES.FRONTEND_URL}/reset-password?token=${token}`;
    const emailBody = `
    <h1 style="color: #444;">Reset your password </h1>
      <h3 style="color: #222;">Hello, ${user?.name}</h3>
    <p style="color: #666;">We received a request to reset the password for your account associated with this email address <span style="font-weight:bold"> (${email}). </span></p>
    <p style="color: #666;">Click the button below to reset your password. The reset link will expire in 1 hour.</p>
    <a href="${resetLink}" style="background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; margin: 20px 0; cursor: pointer; display: inline-block;">Reset Password</a>
    <p style="color: #666;">If you did not request a password reset, please ignore this email or reply to let us know. This password reset is only valid for the next hour.</p>
`;
    sendEmail("Password Reset Request", emailBody, [user.email])
      .then(() => {})
      .catch(() => console.log("sending email failed"));
    return { message: "Password reset link sent to your email" };
  }

  public static async resetPassword(data: IResetPassword) {
    const { token, password, confirmPassword } = data;
    if (password !== confirmPassword) {
      throw new CustomError("Passwords do not match", 400);
    }
    const resetToken = await ResetToken.findOne({ where: { token } });
    if (!resetToken) {
      throw new CustomError("Invalid token", 400);
    }
    if (resetToken.expiryDate < new Date()) {
      throw new CustomError("Token expired", 400);
    }
    const user = await UserModel.findOne({ where: { id: resetToken.userId } });
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    user.password = encrypt(password);
    await user.save();
    const { name, email } = user;
    const emailBody = `
    <div style="text-align: left;">
    <h1 style="color: #444; text-align: center;">Password Reset Successful </h1>
      <h3  style="color: #222;">Hello, ${name}</h3>
      <p style="color: #666; ">Your password has been successfully reset. You can now log in using your new password for your account associated with this email address <span style="font-weight:bold"> (${email}). </span></p>
      <p style="color: #666;">If you did not request this change, please contact our support team immediately.</p>
    </div>
  `;
    await sendEmail("Password Reset Successful", emailBody, [email]);

    await resetToken.destroy();
    return { message: "Password reset successful" };
  }

  public static async changeInstitution(
    userId: string,
    data: ChangeInstitution
  ): Promise<boolean> {
    const hasInstitution = await UserInstitutions.findOne({
      where: { userId, institutionId: data.institutionId },
    });
    if (hasInstitution) {
      await UserModel.update(
        { institutionId: data.institutionId },
        { where: { id: userId } }
      );
      return true;
    } else {
      return false;
    }
  }
}

export default AuthService;
