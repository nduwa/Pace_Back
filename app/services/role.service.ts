import PermissionModel from "../database/models/PermissionModel";
import RolePermissions from "../database/models/RolePermissions";
import RolesModel from "../database/models/RolesModel";
import UserRoles from "../database/models/UserRoles";
import { IAssignPermissionsRequest, IRoleRequest } from "../type";
import { TimestampsNOrder } from "../utils/DBHelpers";

class RolesService {
  public static async addRole(
    institutionId: string | null,
    role: IRoleRequest
  ): Promise<RolesModel> {
    const createdRole = await RolesModel.create({
      label: role.label,
      institutionId,
    });
    const rolePermissions = role.permissions?.map((permission) => {
      return { roleId: createdRole.id, permissionId: permission };
    });

    rolePermissions && (await RolePermissions.bulkCreate(rolePermissions));

    return createdRole;
  }

  public static async deleteRole(id: string): Promise<number> {
    return await RolesModel.destroy({ where: { id: id } });
  }

  public static async getRoleWithPermissions(
    id: string
  ): Promise<RolesModel | null> {
    return RolesModel.findByPk(id, {
      include: [{ model: PermissionModel, ...TimestampsNOrder }],
    });
  }

  public static async getRolesList(
    institutionId: string | null
  ): Promise<RolesModel[]> {
    return RolesModel.findAll({
      ...TimestampsNOrder,
      where: { institutionId },
    });
  }

  public static async getRolesWithPermissions(
    institutionId: string | null
  ): Promise<RolesModel[]> {
    return RolesModel.findAll({
      include: [{ model: PermissionModel }],
      where: { institutionId },
      ...TimestampsNOrder,
    });
  }

  public static async updateRole(
    id: string,
    data: IRoleRequest
  ): Promise<boolean> {
    await RolesModel.update({ label: data.label }, { where: { id } });

    const existingPermissions = await RolePermissions.findAll({
      where: { roleId: id },
    });

    const existingPermissionIds = existingPermissions.map(
      (permission) => permission.permissionId
    );
    const updatedPermissionIds = data.permissions || [];

    const permissionsToDelete = existingPermissionIds.filter(
      (permissionId) => !updatedPermissionIds.includes(permissionId)
    );

    await RolePermissions.destroy({
      where: { permissionId: permissionsToDelete },
    });

    await Promise.all(
      updatedPermissionIds.map(async (permissionId) => {
        await RolePermissions.findOrCreate({
          where: { roleId: id, permissionId: permissionId },
          defaults: { roleId: id, permissionId: permissionId },
        });
      })
    );

    return true;
  }

  public static async assignRoles(
    id: string,
    data: IAssignPermissionsRequest
  ): Promise<boolean> {
    const existingRoles = await UserRoles.findAll({
      where: { userId: id },
    });

    const existingRolesIds = existingRoles.map((role) => role.roleId);
    const updatedRolesIds = data.roles || [];

    const rolesToDelete = existingRolesIds.filter(
      (roleId) => !updatedRolesIds.includes(roleId)
    );

    await Promise.all(
      rolesToDelete.map(async (roleId) => {
        await UserRoles.destroy({
          where: { userId: id, roleId: roleId },
        });
      })
    );

    await Promise.all(
      updatedRolesIds.map(async (roleId) => {
        await UserRoles.findOrCreate({
          where: { userId: id, roleId: roleId },
          defaults: { userId: id, roleId: roleId },
        });
      })
    );

    return true;
  }

  public static async removeRole(
    id: string,
    data: IAssignPermissionsRequest
  ): Promise<boolean> {
    if (data.roles) {
      await Promise.all(
        data.roles?.map(async (role: string) => {
          await UserRoles.destroy({
            where: { userId: id, roleId: role },
          });
        })
      );
    }

    return true;
  }
}

export default RolesService;
