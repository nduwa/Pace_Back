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
import { IPaged } from "../type";
import {
  IDrugDTO,
  IDrugRequest,
  IDrugResponse,
  IInstitutionDrug,
  IInstitutionDrugResponse,
  IPriceChange,
} from "../type/drugs";
import DrugService from "../services/drug.service";

@Tags("Drugs")
@Route("api/drugs")
@Security("jwtAuth")
export class DrugController extends Controller {
  @Get()
  public static async getAll(
    @Inject() institutionId: string | null,
    @Inject() currentPage: number,
    @Inject() limit: number,
    @Inject() searchq: string | undefined,
    @Inject() isOnMarket: string | undefined,
    @Inject() drugCategory: string | undefined
  ): Promise<IPaged<IDrugResponse>> {
    const { page, pageSize, offset } = Paginations(currentPage, limit);
    const drugs = await DrugService.getAll(
      institutionId,
      pageSize,
      offset,
      searchq,
      isOnMarket,
      drugCategory
    );

    const filtersUsed: IDrugResponse = {
      isOnMarket: isOnMarket ?? "yes",
      drugCategory: drugCategory ?? "all",
      rows: drugs.data as unknown as IDrugDTO[],
    };
    return {
      data: filtersUsed,
      totalItems: drugs.totalItems,
      currentPage: page,
      itemsPerPage: pageSize,
    };
  }

  @Get("/institution")
  public static async getInstitutionDrugs(
    @Inject() institutionId: string | null,
    @Inject() currentPage: number,
    @Inject() limit: number,
    @Inject() listType: string,
    @Inject() drug: string | undefined
  ): Promise<IPaged<IInstitutionDrugResponse>> {
    const { page, pageSize, offset } = Paginations(currentPage, limit);
    const drugs = await DrugService.getInstitutionDrugs(
      institutionId,
      pageSize,
      offset,
      listType,
      drug
    );

    const filtersUsed: IInstitutionDrugResponse = {
      listType,
      drug: drug ?? "all",
      rows: drugs.data,
    };
    return {
      data: filtersUsed,
      totalItems: drugs.totalItems,
      currentPage: page,
      itemsPerPage: pageSize,
    };
  }

  @Get("/{id}")
  public static async getOne(@Path() id: string): Promise<IDrugDTO> {
    return await DrugService.getOne(id);
  }

  @Post()
  public static async create(
    @Body() data: IDrugRequest,
    @Inject() institutionId: string | null
  ): Promise<IDrugDTO> {
    const response = await DrugService.create(institutionId, data);
    return response;
  }

  @Put("/{id}")
  public static async update(
    @Path() id: string,
    @Body() data: IDrugRequest
  ): Promise<boolean> {
    return await DrugService.update(id, data);
  }

  @Delete("/{id}")
  public static async delete(@Path() id: string): Promise<number> {
    return await DrugService.delete(id);
  }

  @Get("/all")
  public static async all(
    @Inject() institutionId: string | null
  ): Promise<IDrugDTO[]> {
    return await DrugService.getAllNPaged(institutionId);
  }

  @Get("/institution/all")
  public static async institutionAll(
    @Inject() institutionId: string | null
  ): Promise<IInstitutionDrug[]> {
    return await DrugService.getAllInstitutionNPaged(institutionId);
  }

  @Get("/institution/grouped")
  public static async institutionGrouped(
    @Inject() institutionId: string | null
  ): Promise<IInstitutionDrug[]> {
    return await DrugService.getAllInstitutionGroupedNPaged(institutionId);
  }

  @Put("/{id}/prices")
  public static async updatePrice(
    @Body() data: IPriceChange,
    @Inject() institutionId: string,
    @Path() id: string
  ): Promise<boolean> {
    return await DrugService.updatePrice(data, institutionId, id);
  }

  @Put("/{id}/insurance-prices")
  public static async updateInsurancePrice(
    @Body() data: IPriceChange,
    @Inject() institutionId: string,
    @Path() id: string
  ): Promise<boolean> {
    return await DrugService.updateInsurancePrice(data, institutionId, id);
  }
}
