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
  IUserWithPermissions,
  IUsersResponse,
  UserReponse,
} from "../type/auth";
import UserService from "../services/user.service";
import { Paginations } from "../utils/DBHelpers";
import RolesService from "../services/role.service";
import { IPaged } from "../type";

@Tags("Users")
@Route("api/users")
@Security("jwtAuth")
export class UserController extends Controller {
  @Get("/")
  public static async getAllUsers(
    @Inject() institutionId: string | null,
    @Inject() currentPage: number,
    @Inject() limit: number,
    @Inject() searchq: string | undefined
  ): Promise<IPaged<IUsersResponse>> {
    const { page, pageSize, offset } = Paginations(currentPage, limit);
    const users = await UserService.getUsers(
      institutionId,
      pageSize,
      offset,
      searchq
    );

    const filtersUsed: IUsersResponse = {
      rows: users.data as unknown as IUserWithPermissions[],
    };
    return {
      data: filtersUsed,
      totalItems: users.totalItems,
      currentPage: page,
      itemsPerPage: pageSize,
    };
  }

  @Get("/{id}")
  public static async getUserWithPermissionsByPk(
    @Path() id: string
  ): Promise<IUserWithPermissions> {
    return (await UserService.getUser({
      id,
    })) as IUserWithPermissions;
  }

  @Post()
  public static async createUser(
    @Body() user: ICreateUser,
    @Inject() institutionId: string | null
  ): Promise<UserReponse> {
    const createdUser = await UserService.create(institutionId, user);
    return createdUser;
  }

  @Put("/profile")
  public static async updateUserProfile(
    @Inject() id: string,
    @Body() data: IUpdateUser
  ): Promise<boolean> {
    return await UserService.updateUserProfile(id, data);
  }

  @Post("/{id}/permissions")
  public static async assignPermissions(
    @Path() id: string,
    @Body() data: IAssignPermissionsRequest
  ): Promise<boolean> {
    try {
      await RolesService.assignRoles(id, data);
      return true;
    } catch (error) {
      return false;
    }
  }
}