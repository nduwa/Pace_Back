import {
  Route,
  Controller,
  Post,
  Tags,
  Response,
  Body,
  Security,
  Inject,
  Get,
  Put,
} from "tsoa";
import {
  IJWTPayload,
  ILogin,
  IRegister,
  IResetPassword,
  IResetPasswordRequest,
  IUpdatePassword,
  IUserWithPermissions,
} from "../type";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import CustomError from "../utils/CustomError";
import { compare, encrypt } from "../utils/Password";
import UserModel from "../database/models/UserModel";

@Tags("Authorization")
@Route("api/auth")
export class AuthController extends Controller {
  @Response(201)
  @Post("register")
  public static async register(
    @Body() data: IRegister
  ): Promise<IJWTPayload | null> {
    const user = await AuthService.register(data);
    return user;
  }

  @Post("login")
  public static async login(@Body() data: ILogin): Promise<IJWTPayload> {
    const user = await AuthService.login(data);
    return user;
  }

  @Security("jwtAuth")
  @Get("/")
  public static async me(@Inject() id: string): Promise<IUserWithPermissions> {
    const user = await UserService.getUser({ id });
    return user;
  }

  @Response(200)
  @Post("reset-password-request")
  public static async resetPasswordRequest(
    @Body() body: IResetPasswordRequest
  ) {
    return AuthService.resetPasswordRequest(body);
  }

  @Response(200)
  @Post("reset-password")
  public static async resetPassword(@Body() body: IResetPassword) {
    return AuthService.resetPassword(body);
  }

  @Response(200)
  @Put("/update-password")
  @Security("jwtAuth")
  public static async updatePassword(
    @Body() updatePassword: IUpdatePassword,
    @Inject() user: IUserWithPermissions
  ): Promise<void> {
    const { oldPassword, newPassword, confirmPassword } = updatePassword;
    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new CustomError("All fields are required", 400);
    }
    const passwordMatch = compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new CustomError("Incorrect old password", 406);
    }
    if (newPassword !== confirmPassword) {
      throw new CustomError(
        "New password and confirm password do not match",
        400
      );
    }
    const encryptedPassword = encrypt(newPassword);
    await UserModel.update(
      { password: encryptedPassword },
      { where: { id: user.id } }
    );
  }
}
