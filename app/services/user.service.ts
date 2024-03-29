import { Op } from "sequelize";
import PermissionModel from "../database/models/PermissionModel";
import UserModel from "../database/models/UserModel";
import {
  ICreateUser,
  INewUserDTO,
  IRegister,
  IUpdateUser,
  IUserWithPermissions,
  Paged,
  UserPermission,
  UserReponse,
} from "../type";
import { QueryOptions, TimestampsNOrder } from "../utils/DBHelpers";
import CustomError from "../utils/CustomError";
import { encrypt } from "../utils/Password";

class UserService {
  public static async getUser(
    where: Record<string, string | number>,
    withPermissions: boolean | undefined = true
  ): Promise<IUserWithPermissions> {
    const user = await UserModel.findOne({
      where,
      include: withPermissions
        ? [
            {
              model: PermissionModel,
              attributes: ["id", "label"],
              through: {
                attributes: [],
              },
            },
          ]
        : [],
    });
    let profileJson = user?.toJSON();
    if (withPermissions) {
      const permissions: UserPermission[] = profileJson.permissions.map(
        (permission: UserPermission) => ({
          label: permission.label,
          id: permission.id,
        })
      );

      profileJson = { ...profileJson, permissions };
    }

    return profileJson as unknown as IUserWithPermissions;
  }

  public static async getUsers(
    limit: number,
    offset: number,
    searchq: string | undefined
  ): Promise<Paged<UserModel[]>> {
    let queryOptions = QueryOptions(["name", "email"], searchq);

    const data = await UserModel.findAll({
      include: [{ model: PermissionModel }],
      where: {
        ...queryOptions,
        // email: { [Op.not]: "root@sudos.rw" }
      },
      ...TimestampsNOrder,
      attributes: {
        exclude: ["password", "deletedAt", "updatedAt"],
      },

      group: ["UserModel.id"],
      limit,
      offset,
    });

    const totalItems = await UserModel.count({
      where: {
        ...queryOptions,
      },
    });
    return { data, totalItems };
  }

  public static async create(data: ICreateUser): Promise<UserReponse> {
    const emailTaken = await UserService.getUser({ email: data.email }, false);
    const phoneTaken = await UserService.getUser({ phone: data.phone }, false);
    if (emailTaken || phoneTaken) {
      const message =
        emailTaken && phoneTaken
          ? "Email and phone were taken"
          : emailTaken
          ? "Email was taken"
          : "Phone was taken";
      throw new CustomError(message, 409);
    }
    const password = encrypt("Pa$$word"); // TODO: random password generation and send to email/phone
    const userWithpassword = { ...data, password } as INewUserDTO;

    const newUser = await UserModel.create({ ...userWithpassword });
    return newUser.toJSON() as UserReponse;
  }

  public static async updateUserProfile(
    id: string,
    data: IUpdateUser
  ): Promise<boolean> {
    try {
      await UserModel.update({ ...data }, { where: { id: id } });
      return true;
    } catch (error) {
      throw new CustomError((error as Error).message, 400);
    }
  }
}

export default UserService;
