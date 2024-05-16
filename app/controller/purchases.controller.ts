import {
  Route,
  Controller,
  Tags,
  Response,
  Security,
  Post,
  Body,
  Get,
  Path,
  Put,
  Delete,
  Inject,
  Query,
} from "tsoa";
import {
  IAdjustPurchaseDTO,
  ICreatePurchaseDTO,
  IDrugPurchase,
  IDrugPurchaseResponse,
  IInstitutionDrug,
  IPurchase,
} from "../type/drugs";
import PurchaseService from "../services/purchases.service";
import { Paginations } from "../utils/DBHelpers";
import { IPaged, Paged } from "../type";
import DrugService from "../services/drug.service";

@Tags("purchases")
@Route("api/purchases")
@Security("jwtAuth")
export class PurchaseController extends Controller {
  @Response(201, "Created")
  @Post()
  public static async addPurchase(
    @Inject() institutionId: string,
    @Body() data: ICreatePurchaseDTO
  ): Promise<IPurchase> {
    return PurchaseService.createPurchase(institutionId, data);
  }

  @Put("{id}")
  public static async update(
    @Inject() id: string,
    @Inject() institutionId: string,
    @Body() data: ICreatePurchaseDTO
  ): Promise<IPurchase> {
    return PurchaseService.update(id, institutionId, data);
  }

  @Get()
  public static async getAllPurchases(
    @Inject() institutionId: string,
    @Inject() currentPage: number,
    @Inject() limit: number,
    @Inject() searchq: string | undefined
  ): Promise<IPaged<IPurchase[]>> {
    const { page, pageSize, offset } = Paginations(currentPage, limit);

    const purchasesList = await PurchaseService.getAllPurchases(
      institutionId,
      pageSize,
      offset,
      searchq
    );
    return {
      ...purchasesList,
      currentPage: page,
      itemsPerPage: pageSize,
    };
  }

  @Get("{id}")
  public static async getOne(@Path() id: string): Promise<IPurchase | null> {
    const purchasesList = await PurchaseService.getOne(id);
    return purchasesList;
  }

  @Get("{id}/approve")
  public static async approve(@Path() id: string): Promise<IPurchase | null> {
    const result = await PurchaseService.approve(id);
    return result;
  }

  @Get("/drugs-purchases/{id}")
  public static async getDrugsByPurchase(
    @Path() id: string
  ): Promise<IDrugPurchase[]> {
    const purchasesList = await DrugService.getDrugsByPurchase(id);
    return purchasesList;
  }

  public static async getDrugPurchaseHistory(
    @Inject() institutionId: string,
    @Inject() currentPage: number,
    @Inject() limit: number
  ): Promise<IPaged<IDrugPurchaseResponse>> {
    const { page, pageSize, offset } = Paginations(currentPage, limit);

    const purchasesList = (await DrugService.getDrugPurchaseHistory(
      institutionId,
      pageSize,
      offset
    )) as unknown as Paged<IDrugPurchase[]>;
    const filtersUsed: IDrugPurchaseResponse = {
      rows: purchasesList.data as unknown as IDrugPurchase[],
    };
    return {
      data: filtersUsed,
      totalItems: purchasesList.totalItems,
      currentPage: page,
      itemsPerPage: pageSize,
    };
  }

  @Post("/drugs-purchases")
  public static async drugsAdjust(
    @Body() data: IAdjustPurchaseDTO
  ): Promise<boolean> {
    return await PurchaseService.drugsAdjust(data);
  }

  @Delete("{id}")
  public static async delete(@Path() id: string): Promise<number> {
    return await PurchaseService.destroy(id);
  }
}
