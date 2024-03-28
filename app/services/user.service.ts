import PermissionModel from "../database/models/PermissionModel";
import UserModel from "../database/models/UserModel";
import { IUserWithPermissions, UserPermission } from "../type";

class UserService {
  public static async userWithPermissions(
    where: Record<string, string | number>
  ): Promise<IUserWithPermissions> {
    const user = await UserModel.findOne({
      where,
      include: [
        {
          model: PermissionModel,
          attributes: ["id", "label"],
          through: {
            attributes: [],
          },
        },
      ],
    });
    const profileJson = user?.toJSON();
    const permissions: UserPermission[] = profileJson.permissions.map(
      (permission: UserPermission) => ({
        label: permission.label,
        id: permission.id,
      })
    );

    return { ...profileJson, permissions } as unknown as IUserWithPermissions;
  }
}

export default UserService;
