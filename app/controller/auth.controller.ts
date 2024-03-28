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
} from "tsoa";
import { IJWTPayload, ILogin, IRegister, IUserWithPermissions } from "../type";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";

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
    const user = await UserService.userWithPermissions({ id });
    return user;
  }
}
