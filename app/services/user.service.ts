import { Op } from "sequelize";
import PermissionModel from "../database/models/PermissionModel";
import UserModel from "../database/models/UserModel";
import {
  ICreateUser,
  IRole,
  IUpdateUser,
  IUser,
  IUserWithPermissions,
  Paged,
  UserPermission,
  UserReponse,
} from "../type";
import { QueryOptions, TimestampsNOrder } from "../utils/DBHelpers";
import CustomError from "../utils/CustomError";
import { encrypt } from "../utils/Password";
import UserInstitutions from "../database/models/UserInstitutions";
import RolesModel from "../database/models/RolesModel";
import RolePermissions from "../database/models/RolePermissions";

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
              model: RolesModel,
              attributes: ["id", "label", "institutionId"],
              through: {
                attributes: [],
              },
              as: "roles",
            },
            "institutions",
            "institution",
          ]
        : [],
    });
    let profileJson = user?.toJSON();
    if (withPermissions) {
      const roleIds = profileJson.roles
        .filter((role: IRole) => role.institutionId == user?.institutionId)
        .map((role: IRole) => role.id);
      const rolePermissions = await RolePermissions.findAll({
        where: { roleId: { [Op.in]: roleIds } },
        include: ["permission"],
      });
      const permissions: UserPermission[] = rolePermissions.map(
        (rolePermission: RolePermissions) => ({
          label: rolePermission.permission.label,
          id: rolePermission.permissionId,
        })
      );

      profileJson = { ...profileJson, permissions };
    }

    return profileJson as unknown as IUserWithPermissions;
  }

  public static async getUsers(
    institutionId: string | null,
    limit: number,
    offset: number,
    searchq: string | undefined
  ): Promise<Paged<UserModel[]>> {
    let queryOptions = QueryOptions(["name", "email"], searchq);

    const userIds = institutionId
      ? (await UserInstitutions.findAll({ where: { institutionId } })).map(
          (user) => user.userId
        )
      : [];

    const userIdsOpt = institutionId
      ? { id: { [Op.in]: userIds } }
      : { institutionId: null };

    queryOptions = { ...queryOptions, ...userIdsOpt };

    const data = await UserModel.findAll({
      // include: ["roles"],
      where: {
        ...queryOptions,
        // email: { [Op.not]: "root@sudos.rw" }
      },
      ...TimestampsNOrder,
      attributes: {
        exclude: ["password", "deletedAt", "updatedAt"],
      },

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

  public static async create(
    institutionId: string | null,
    data: ICreateUser
  ): Promise<UserReponse> {
    const userWithEmail = await UserService.getUser(
      { email: data.email },
      false
    );
    let user: IUser;
    if (userWithEmail) user = userWithEmail;
    else {
      const phoneTaken = await UserService.getUser(
        { phone: data.phone },
        false
      );
      if (phoneTaken) throw new CustomError("Phone was  taken", 409);
      const password = encrypt("Pa$$word");

      const createUser = await UserModel.create({
        ...data,
        password,
        institutionId,
      });
      user = createUser.toJSON();
    }

    if (institutionId) {
      await UserInstitutions.findOrCreate({
        where: { userId: user.id, institutionId },
        defaults: { userId: user.id, institutionId },
      });
    }

    return user as UserReponse;
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
