import UserModel from "../database/models/UserModel";
import {
  IInstitution,
  IInstitutionDTO,
  IInstitutionRequest,
  IUser,
  Paged,
  UserReponse,
} from "../type";
import { QueryOptions, TimestampsNOrder } from "../utils/DBHelpers";
import CustomError from "../utils/CustomError";
import { encrypt } from "../utils/Password";
import InstitutionModel from "../database/models/Institution";
import UserInstitutions from "../database/models/UserInstitutions";
import UserService from "./user.service";
import PermissionModel from "../database/models/PermissionModel";
import RolesService from "./role.service";

class InstitutionService {
  public static async getOne(id: string): Promise<IInstitutionDTO | null> {
    return (await InstitutionModel.findByPk(id, {
      include: ["users"],
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
      },
      ...TimestampsNOrder,

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

    const adminPermission = await PermissionModel.findOne({
      where: { label: "INSTITUTION_ADMIN" },
    });

    if (adminPermission !== null) {
      const role = await RolesService.addRole(institution.id, {
        label: "INSTITUTION_ADMIN",
        permissions: [adminPermission?.id],
      });

      await RolesService.assignRoles(user.id, {
        id: user.id,
        roles: [role.id],
      });
    }

    await UserModel.update(
      { institutionId: institution.id },
      { where: { id: user.id } }
    );

    return institution.toJSON();
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
}

export default InstitutionService;
