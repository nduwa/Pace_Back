import {
  Route,
  Controller,
  Tags,
  Response,
  Security,
  Post,
  Body,
  Get,
  Put,
  Inject,
  Delete,
} from "tsoa";
import appPersmissions, {
  IPermissionGroup,
  permissionBasedOnInstitution,
} from "../database/constants/permissions";
import PermissionModel from "../database/models/PermissionModel";
import { Request } from "express";
import { error } from "console";
import {
  IPermission,
  IRole,
  IRoleRequest,
  RoleResponseDTO,
} from "../type/auth";
import RolesService from "../services/role.service";
import InstitutionModel from "../database/models/Institution";
import { Op } from "sequelize";

@Tags("Roles and Permissions")
@Route("api/roles")
@Security("jwtAuth")
export class RolesController extends Controller {
  @Response(201, "Created")
  @Post()
  public static async createRole(
    @Body() role: IRoleRequest,
    @Inject() institutionId: string | null
  ): Promise<RoleResponseDTO> {
    const createdRole = (await RolesService.addRole(
      institutionId,
      role
    )) as unknown as IRole;
    const rolesAndPermissions = (
      await RolesService.getRoleWithPermissions(createdRole.id)
    )?.toJSON();
    return {
      ...rolesAndPermissions,
      permissions: rolesAndPermissions.permissions.map(
        (permission: IPermission) => {
          return {
            id: permission.id,
            label: permission.label,
            createdAt: permission.createdAt,
            updatedAt: permission.updatedAt,
          };
        }
      ),
    };
  }

  @Put("/{id}")
  public static async updateRole(
    @Body() data: IRoleRequest,
    @Inject() id: string
  ): Promise<RoleResponseDTO | null> {
    try {
      await RolesService.updateRole(id, data);
      const rolesAndPermissions = (
        await RolesService.getRoleWithPermissions(id)
      )?.toJSON();
      return {
        ...rolesAndPermissions,
        permissions: rolesAndPermissions.permissions.map(
          (permission: IPermission) => {
            return {
              id: permission.id,
              label: permission.label,
              createdAt: permission.createdAt,
              updatedAt: permission.updatedAt,
            };
          }
        ),
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  @Get("/{id}")
  public static async getRole(@Inject() id: string): Promise<RoleResponseDTO> {
    const rolesAndPermissions = (
      await RolesService.getRoleWithPermissions(id)
    )?.toJSON();
    return {
      ...rolesAndPermissions,
      permissions: rolesAndPermissions.permissions.map(
        (permission: IPermission) => {
          return {
            id: permission.id,
            label: permission.label,
            createdAt: permission.createdAt,
            updatedAt: permission.updatedAt,
          };
        }
      ),
    };
  }

  @Delete("/{id}")
  public static async deleteRole(@Inject() id: string): Promise<number> {
    const deleteRole = await RolesService.deleteRole(id);
    return deleteRole;
  }

  @Get()
  public static async getAllRoles(
    @Inject() institutionId: string | null
  ): Promise<RoleResponseDTO[] | null> {
    try {
      const roles = await RolesService.getRolesWithPermissions(institutionId);
      const results = roles.map((role) => {
        const roleToJson = role.toJSON();
        return {
          ...roleToJson,
          permissions: roleToJson.permissions.map(
            (permission: IPermission) => ({
              id: permission.id,
              label: permission.label,
              createdAt: permission.createdAt,
              updatedAt: permission.updatedAt,
            })
          ),
        };
      });
      return results;
    } catch {
      console.error(error);
      return null;
    }
  }

  @Get("/list")
  public static async getRolesList(
    @Inject() institutionId: string | null
  ): Promise<IRole[]> {
    const rolesList = (await RolesService.getRolesList(
      institutionId
    )) as unknown as IRole[];
    return rolesList;
  }

  @Get("/permissions")
  public static async getPermissionsWithGroup(
    @Inject() institutionId: string | null
  ): Promise<IPermissionGroup[]> {
    let groups;

    if (institutionId != null) {
      const institution = await InstitutionModel.findOne({
        where: { id: institutionId },
      });
      const type = institution?.institutionType as string;

      const institutionPermissions = (permissionBasedOnInstitution as any)[
        type
      ] as string[];

      groups = appPersmissions.filter((x) =>
        institutionPermissions.includes(x.group.toUpperCase())
      );
    } else {
      const institutionPermissions = (permissionBasedOnInstitution as any)[
        "ADMIN"
      ] as string[];
      groups = appPersmissions.filter((x) =>
        institutionPermissions.includes(x.group.toUpperCase())
      );
    }

    return groups as unknown as IPermissionGroup[];
  }

  @Get("/app/permissions")
  public static async getPermissions(
    @Inject() institutionId: string | null
  ): Promise<IPermission[]> {
    let permissionsLabels: string[];
    if (institutionId != null) {
      const institution = await InstitutionModel.findByPk(institutionId);
      const type = institution?.institutionType as string;
      const institutionPermissions = (permissionBasedOnInstitution as any)[
        type
      ] as string[];

      permissionsLabels = appPersmissions
        .filter((x) => institutionPermissions.includes(x.group.toUpperCase()))
        .map((x) => x.permissions)
        .flat();
    } else {
      const institutionPermissions = (permissionBasedOnInstitution as any)[
        "ADMIN"
      ] as string[];
      permissionsLabels = appPersmissions
        .filter((x) => institutionPermissions.includes(x.group.toUpperCase()))
        .map((x) => x.permissions)
        .flat();
    }

    const permissions = await PermissionModel.findAll({
      where: { label: { [Op.in]: permissionsLabels } },
    });

    return permissions as unknown as IPermission[];
  }
}
