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
  Delete,
} from "tsoa";
import {
  IInstitution,
  IInstitutionDTO,
  IInstitutionRequest,
  IInstitutionResponse,
  IPaged,
} from "../type";
import { Paginations } from "../utils/DBHelpers";
import InstitutionService from "../services/institution.service";

@Tags("Institutions")
@Route("api/institutions")
@Security("jwtAuth")
export class InstitutionController extends Controller {
  @Get("/")
  public static async getAll(
    @Inject() currentPage: number,
    @Inject() limit: number,
    @Inject() searchq: string | undefined,
    @Inject() type: string | undefined
  ): Promise<IPaged<IInstitutionResponse>> {
    const { page, pageSize, offset } = Paginations(currentPage, limit);
    const institutions = await InstitutionService.getAll(
      pageSize,
      offset,
      searchq,
      type
    );

    const filtersUsed: IInstitutionResponse = {
      type: type ?? "all",
      rows: institutions.data as unknown as IInstitutionDTO[],
    };
    return {
      data: filtersUsed,
      totalItems: institutions.totalItems,
      currentPage: page,
      itemsPerPage: pageSize,
    };
  }

  @Get("/{id}")
  public static async getOne(@Path() id: string): Promise<IInstitutionDTO> {
    return (await InstitutionService.getOne(id)) as IInstitutionDTO;
  }

  @Post()
  public static async create(
    @Body() data: IInstitutionRequest
  ): Promise<IInstitution> {
    const result = await InstitutionService.create(data);
    return result;
  }

  @Put("/{id}")
  public static async update(
    @Path() id: string,
    @Body() data: IInstitutionRequest
  ): Promise<boolean> {
    return await InstitutionService.update(id, data);
  }

  @Delete("/{id}")
  public static async delete(@Path() id: string): Promise<boolean> {
    return await InstitutionService.delete(id);
  }
}
