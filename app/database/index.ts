import Consultations from "./models/Consultations";
import DrugCategory from "./models/DrugCategory";
import DrugModel from "./models/DrugModel";
import DrugPurchasesModel from "./models/DrugPurchases";
import ExamModel from "./models/ExamModel";
import FormConsultations from "./models/FormConsultations";
import FormDrugs from "./models/FormDrugs";
import FormExams from "./models/FormExams";
import FormModel from "./models/FormModel";
import InstitutionModel from "./models/Institution";
import InstitutionDrugs from "./models/InstututionDrugs";
import InvoiceConsultations from "./models/InvoiceConsultations";
import InvoiceDrugsModel from "./models/InvoiceDrugsModel";
import InvoiceExams from "./models/InvoiceExams";
import InvoiceModel from "./models/InvoiceModel";
import PatientsModel from "./models/PatientsModel";
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

  InvoiceModel,
  InvoiceDrugsModel,
  PatientsModel,

  InvoiceExams,
  InvoiceConsultations,

  ExamModel,
  Consultations,

  FormModel,
  FormExams,
  FormDrugs,
  FormConsultations,
];

export default models;
