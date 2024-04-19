import DrugCategory from "./models/DrugCategory";
import DrugModel from "./models/DrugModel";
import DrugPurchasesModel from "./models/DrugPurchases";
import InstitutionModel from "./models/Institution";
import InstitutionDrugs from "./models/InstututionDrugs";
import PermissionModel from "./models/PermissionModel";
import PurchasesModel from "./models/PurchasesModel";
import ResetToken from "./models/ResetToken";
import RolePermissions from "./models/RolePermissions";
import RolesModel from "./models/RolesModel";
import Transactions from "./models/Transactions";
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
  PurchasesModel,
  DrugPurchasesModel,
  InstitutionDrugs,
  DrugCategory,

  Transactions,
];

export default models;
