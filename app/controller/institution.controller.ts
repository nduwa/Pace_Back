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
  Delete,
} from "tsoa";

import { Paginations } from "../utils/DBHelpers";
import InstitutionService from "../services/institution.service";
import { IPaged } from "../type";
import {
  ICreateBranch,
  IInstitution,
  IInstitutionDTO,
  IInstitutionRequest,
  IInstitutionResponse,
} from "../type/instutution";

@Tags("Institutions")
@Route("api/institutions")
@Security("jwtAuth")
export class InstitutionController extends Controller {
  @Get("/")
  public static async getAll(
    @Inject() currentPage: number,
    @Inject() limit: number,
    @Inject() searchq: string | undefined,
    @Inject() type: string | undefined,
    @Inject() level: string | undefined
  ): Promise<IPaged<IInstitutionResponse>> {
    const { page, pageSize, offset } = Paginations(currentPage, limit);
    const institutions = await InstitutionService.getAll(
      pageSize,
      offset,
      searchq,
      type,
      level
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

  @Get("/pharmacies")
  public static async getPharmacies(): Promise<IInstitutionDTO[]> {
    return await InstitutionService.getByType("PHARMACY");
  }

  @Get("/insurances")
  public static async getInsurances(): Promise<IInstitutionDTO[]> {
    return await InstitutionService.getByType("INSURANCE");
  }

  @Post()
  public static async create(
    @Body() data: IInstitutionRequest
  ): Promise<IInstitution> {
    const result = await InstitutionService.create(data);
    return result;
  }

  @Post("branches")
  public static async createBranches(
    @Body() data: ICreateBranch,
    @Inject() userId: string
  ): Promise<IInstitution> {
    const result = await InstitutionService.createBranch(userId, data);
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

  @Get("/all")
  public static async all(): Promise<IInstitutionDTO[]> {
    return await InstitutionService.getAllNPaged();
  }
}
