import {
  Route,
  Controller,
  Post,
  Tags,
  Body,
  Security,
  Inject,
  Get,
  Put,
  Path,
} from "tsoa";
import {
  IAssignPermissionsRequest,
  ICreateUser,
  IRegister,
  IUpdateUser,
  IUser,
  IUserWithPermissions,
  IUsersResponse,
  UserReponse,
} from "../type/auth";
import UserService from "../services/user.service";
import { DatesOpt, Paginations } from "../utils/DBHelpers";
import RolesService from "../services/role.service";
import { IPaged } from "../type";
import { IInstitution } from "../type/instutution";
import InstitutionModel from "../database/models/Institution";
import DrugModel from "../database/models/DrugModel";
import { Op } from "sequelize";
import InstitutionDrugs from "../database/models/InstututionDrugs";
import ExamModel from "../database/models/ExamModel";
import Transactions from "../database/models/Transactions";
import PurchasesModel from "../database/models/PurchasesModel";
import InvoiceModel from "../database/models/InvoiceModel";
import UserInstitutions from "../database/models/UserInstitutions";
import UserModel from "../database/models/UserModel";
import FormModel from "../database/models/FormModel";

@Tags("Dashboard")
@Route("api/dashboard")
@Security("jwtAuth")
export class DashboardController extends Controller {
  static institution: IInstitution;
  static userId: string;
  static user: IUser | null;
  static result: any;

  @Get()
  public static async index(
    @Inject() institutionId: string,
    @Inject() userId: string
  ) {
    this.userId = userId;

    const drugsCount = await DrugModel.count({
      where: {
        [Op.or]: [{ institutionId: null }, { institutionId: institutionId }],
      },
    });

    const usersCount = institutionId
      ? await UserInstitutions.count({
          where: { institutionId },
        })
      : await UserModel.count({ where: { institutionId: { [Op.is]: null } } });

    const drugsInStock = await InstitutionDrugs.count({
      where: { institutionId },
      group: ["drugId"],
    });

    let drugsInStockCount = 0;
    drugsInStock.forEach((item) => {
      drugsInStockCount += 1;
    });

    const openFormsCounts = await FormModel.count({ where: { isOpen: true } });

    const examsCount = await ExamModel.count({});
    const institutionsCount = await InstitutionModel.count({
      where: { institutionId: { [Op.is]: null } },
    });
    const institutionBranchesCount = await InstitutionModel.count({
      where: { institutionId: { [Op.not]: null } },
    });

    this.result = {
      drugsCount,
      drugsInStock: drugsInStockCount,
      examsCount,
      institutionsCount,
      institutionBranchesCount,
      usersCount,
      openFormsCounts,
    };

    return this.result;
  }

  @Get("transactions")
  public static async transactions(
    @Inject() startDate: string | undefined,
    @Inject() endDate: string | undefined,
    @Inject() institutionId: string | null
  ) {
    const datesOpt = DatesOpt(startDate, endDate);

    const queryOptions = {
      ...datesOpt,
      institutionId,
    };

    const income = await Transactions.sum("amount", {
      where: { ...queryOptions, type: "INCOME" },
    });
    const expense = await Transactions.sum("amount", {
      where: { ...queryOptions, type: "EXPENSE" },
    });

    const purchased = await PurchasesModel.sum("totalCost", {
      where: { ...queryOptions, approved: true },
    });
    const invoiced = await InvoiceModel.sum("totalCost", {
      where: { ...queryOptions, published: true },
    });

    return {
      income: income ?? 0,
      expense: expense ?? 0,
      purchased: purchased ?? 0,
      invoiced: invoiced ?? 0,
    };
  }
}
