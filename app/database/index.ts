import DrugModel from "./models/DrugModel";
import InstitutionModel from "./models/Institution";
import PermissionModel from "./models/PermissionModel";
import ResetToken from "./models/ResetToken";
import RolePermissions from "./models/RolePermissions";
import RolesModel from "./models/RolesModel";
import UserInstitutions from "./models/UserInstitutions";
import UserModel from "./models/UserModel";
import UserRoles from "./models/UserRoles";

const models = [
  UserModel,
  PermissionModel,
  ResetToken,
  InstitutionModel,
  UserInstitutions,
  RolesModel,
  RolePermissions,
  UserRoles,

  DrugModel,
];

export default models;
