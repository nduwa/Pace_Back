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
import ServiceActService from "../services/serviceAct.service";
import {
  IServiceAct,
  IServiceActRequest,
  IServiceActResponse,
} from "../type/service";
import { IPriceChange } from "../type/drugs";

@Tags("Service Acts")
@Route("api/service-acts")
@Security("jwtAuth")
export class ServiceActController extends Controller {
  @Get("/")
  public static async getAll(
    @Inject() institutionId: string | null,
    @Inject() currentPage: number,
    @Inject() limit: number,
    @Inject() searchq: string | undefined
  ): Promise<IPaged<IServiceActResponse>> {
    const { page, pageSize, offset } = Paginations(currentPage, limit);
    const services = await ServiceActService.getAll(
      institutionId,
      pageSize,
      offset,
      searchq
    );

    const filtersUsed: IServiceActResponse = {
      rows: services.data as unknown as IServiceAct[],
    };
    return {
      data: filtersUsed,
      totalItems: services.totalItems,
      currentPage: page,
      itemsPerPage: pageSize,
    };
  }

  @Get("/{id}")
  public static async getOne(@Path() id: string): Promise<IServiceAct> {
    return (await ServiceActService.getOne(id)) as IServiceAct;
  }

  @Get("/all")
  public static async getNPaged(
    @Inject() institutionId: string | null
  ): Promise<IServiceAct[]> {
    return await ServiceActService.getNPaged(institutionId);
  }

  @Post()
  public static async create(
    @Body() data: IServiceActRequest
  ): Promise<IServiceAct> {
    const result = await ServiceActService.create(data);
    return result;
  }

  @Put("/{id}")
  public static async update(
    @Path() id: string,
    @Body() data: IServiceActRequest
  ): Promise<boolean> {
    return await ServiceActService.update(id, data);
  }

  @Delete("/{id}")
  public static async delete(@Path() id: string): Promise<boolean> {
    return await ServiceActService.delete(id);
  }

  @Put("/{id}/prices")
  public static async updatePrice(
    @Body() data: IPriceChange,
    @Inject() institutionId: string,
    @Path() id: string
  ): Promise<boolean> {
    return await ServiceActService.updatePrice(data, institutionId, id);
  }
}
