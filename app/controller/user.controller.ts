import {
  Route,
  Controller,
  Post,
  Tags,
  Response,
  Body,
  Security,
  Inject,
  Get,
  Put,
  Path,
} from "tsoa";
import {
  ICreateUser,
  IPaged,
  IRegister,
  IUpdateUser,
  IUserWithPermissions,
  IUsersResponse,
  UserReponse,
} from "../type";
import UserService from "../services/user.service";
import { Paginations } from "../utils/DBHelpers";

@Tags("Users")
@Route("api/users")
@Security("jwtAuth")
export class UserController extends Controller {
  @Get("/")
  public static async getAllUsers(
    @Inject() currentPage: number,
    @Inject() limit: number,
    @Inject() searchq: string | undefined
  ): Promise<IPaged<IUsersResponse>> {
    const { page, pageSize, offset } = Paginations(currentPage, limit);
    const users = await UserService.getUsers(pageSize, offset, searchq);
    const getUser = users.data.map((user) => {
      const userJson = user.toJSON() as IUserWithPermissions;
      return {
        ...userJson,
        permissions: userJson.permissions.map((permission) => ({
          label: permission.label,
          id: permission.id,
        })),
      };
    });
    const filtersUsed: IUsersResponse = {
      rows: getUser,
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
    @Body() user: ICreateUser
  ): Promise<UserReponse> {
    const createdUser = await UserService.create(user);
    return createdUser;
  }

  @Put("/profile")
  public static async updateUserProfile(
    @Inject() id: string,
    @Body() data: IUpdateUser
  ): Promise<boolean> {
    return await UserService.updateUserProfile(id, data);
  }
}
