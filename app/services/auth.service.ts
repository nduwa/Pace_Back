import UserModel from "../database/models/UserModel";
import { IJWTPayload, ILogin, IRegister } from "../type";
import CustomError, { catchSequelizeError } from "../utils/CustomError";
import { compare, encrypt } from "../utils/Password";
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
}

export default AuthService;
