import { Sequelize } from "sequelize";
import appPersmissions, { Permission } from "../database/constants/permissions";
import appUsers from "../database/constants/users";
import PermissionModel from "../database/models/PermissionModel";
import UserModel from "../database/models/UserModel";
import UserRoles from "../database/models/UserRoles";
import RolesModel from "../database/models/RolesModel";
import RolePermissions from "../database/models/RolePermissions";
import { patientsData } from "../database/constants/patients";
import { IPatient } from "../type/drugs";
import PatientsModel from "../database/models/PatientsModel";

const permissions = appPersmissions
  .map((permissionGroup) => permissionGroup.permissions)
  .join(",")
  .split(",") as Permission[];

const loadInitialData = async (db: Sequelize): Promise<void> => {
  try {
    await db.transaction(async (t) => {
      await Promise.all(
        permissions.map(async (permission: Permission) => {
          await PermissionModel.findOrCreate({
            where: { label: permission },
            defaults: { label: permission },
            transaction: t,
          });
        })
      );
    });

    await db.transaction(async (t) => {
      await Promise.all(
        appUsers.map(async (user) => {
          const [createdUser] = await UserModel.findOrCreate({
            where: { email: user.email },
            defaults: { ...user },
          });
          const permission = (await PermissionModel.findOne({
            where: { label: "ALL_PERMISSIONS" },
          })) as unknown as PermissionModel;

          const [role] = await RolesModel.findOrCreate({
            where: { label: "SUDO" },
            defaults: { label: "SUDO" },
          });

          const [sudoRole] = await RolePermissions.findOrCreate({
            where: { permissionId: permission.id, roleId: role?.id },
            defaults: { permissionId: permission.id, roleId: role?.id },
          });
          await UserRoles.findOrCreate({
            where: { userId: createdUser.id, roleId: role.id },
            defaults: { userId: createdUser.id, roleId: role.id },
            transaction: t,
          });
        })
      );
    });
  } catch (error) {
    console.log(error);
  }

  // await db.transaction(async (t) => {
  //   await Promise.all(
  //     patientsData.map(async (patient: IPatient) => {
  //       await PatientsModel.findOrCreate({
  //         where: { NID: patient.NID },
  //         defaults: { ...patient },
  //         transaction: t,
  //         hooks: false,
  //       });
  //     })
  //   );
  // });
};

export default loadInitialData;
