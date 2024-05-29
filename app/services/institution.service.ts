import UserModel from "../database/models/UserModel";
import { QueryOptions, TimestampsNOrder } from "../utils/DBHelpers";
import CustomError from "../utils/CustomError";
import { encrypt } from "../utils/Password";
import InstitutionModel from "../database/models/Institution";
import UserInstitutions from "../database/models/UserInstitutions";
import UserService from "./user.service";
import PermissionModel from "../database/models/PermissionModel";
import RolesService from "./role.service";
import {
  ICreateBranch,
  IInstitution,
  IInstitutionDTO,
  IInstitutionRequest,
} from "../type/instutution";
import { Paged } from "../type";
import { IUser } from "../type/auth";
import { Op } from "sequelize";

class InstitutionService {
  public static async getOne(id: string): Promise<IInstitutionDTO | null> {
    return (await InstitutionModel.findByPk(id, {
      include: ["users", "branches", "parentInstitution"],
    })) as unknown as IInstitutionDTO;
  }

  public static async getAll(
    limit: number,
    offset: number,
    searchq: string | undefined,
    type: string | undefined
  ): Promise<Paged<InstitutionModel[]>> {
    let queryOptions = QueryOptions(["name"], searchq);

    const typeOpt = type && type != "all" ? { institutionType: type } : {};

    queryOptions = { ...queryOptions, ...typeOpt };

    const data = await InstitutionModel.findAll({
      where: {
        ...queryOptions,
        institutionId: { [Op.is]: null },
      },
      ...TimestampsNOrder,
      include: ["branches"],
      limit,
      offset,
    });

    const totalItems = await InstitutionModel.count({
      where: {
        ...queryOptions,
      },
    });
    return { data, totalItems };
  }

  public static async create(data: IInstitutionRequest): Promise<IInstitution> {
    const userWithEmail = await UserService.getUser(
      { email: data.admin.email },
      false
    );
    let user: IUser;
    if (userWithEmail) user = userWithEmail;
    else {
      const password = encrypt("Pa$$word");
      const phoneTaken = await UserService.getUser(
        { phone: data.admin.phone },
        false
      );
      if (phoneTaken) throw new CustomError("Phone was  taken", 409);
      const createUser = await UserModel.create({ ...data.admin, password });
      user = createUser.toJSON();
    }

    const institution = await InstitutionModel.create({
      ...data,
      admin: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

    // set userInstitution
    await UserInstitutions.create({
      userId: user.id,
      institutionId: institution.id,
    });

    if (!userWithEmail)
      await UserModel.update(
        { institutionId: institution.id },
        { where: { id: user.id } }
      );

    const adminPermission = await PermissionModel.findOne({
      where: { label: "INSTITUTION_ADMIN" },
    });

    if (adminPermission !== null) {
      const role = await RolesService.addRole(institution.id, {
        label: "INSTITUTION_ADMIN",
        permissions: [adminPermission?.id],
      });

      await RolesService.assignRoles(user.id, institution.id, {
        id: user.id,
        roles: [role.id],
      });
    }

    return institution.toJSON();
  }

  public static async createBranch(userId: string, data: ICreateBranch) {
    const user = await UserModel.findByPk(userId, {
      include: ["institution"],
    });

    const institution = await user?.institution;
    if (!user) throw new CustomError("Something went wrong");
    if (institution?.institutionId !== null)
      throw new CustomError("This is a branch already");

    const admin = {
      name: user?.name,
      phone: user?.phone,
      email: user?.email,
    };

    const institutionType = institution.institutionType;

    const requestData = {
      ...data,
      admin,
      institutionId: user.institutionId,
      institutionType,
    };
    const branch = await this.create(requestData);
    return branch;
  }

  public static async update(
    id: string,
    data: IInstitutionRequest
  ): Promise<boolean> {
    try {
      await InstitutionModel.update({ ...data }, { where: { id: id } });
      return true;
    } catch (error) {
      throw new CustomError((error as Error).message, 400);
    }
  }

  public static async delete(id: string): Promise<boolean> {
    try {
      await InstitutionModel.destroy({ where: { id: id } });
      return true;
    } catch (error) {
      throw new CustomError((error as Error).message, 400);
    }
  }

  public static async getByType(type: string): Promise<IInstitutionDTO[]> {
    const data = await InstitutionModel.findAll({ where: { type } });
    return data as unknown as IInstitutionDTO[];
  }

  public static async getAllNPaged(): Promise<IInstitutionDTO[]> {
    const drugs = await InstitutionModel.findAll({
      include: ["parentInstitution"],
      order: [["name", "ASC"]],
    });

    return drugs as unknown as IInstitutionDTO[];
  }
}

export default InstitutionService;
