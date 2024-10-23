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
import ServiceService from "../services/service.service";
import { IService, IServiceRequest, IServiceResponse } from "../type/service";

@Tags("Services")
@Route("api/services")
@Security("jwtAuth")
export class ServiceController extends Controller {
  @Get("/")
  public static async getAll(
    @Inject() institutionId: string | null,
    @Inject() currentPage: number,
    @Inject() limit: number,
    @Inject() searchq: string | undefined
  ): Promise<IPaged<IServiceResponse>> {
    const { page, pageSize, offset } = Paginations(currentPage, limit);
    const services = await ServiceService.getAll(
      institutionId,
      pageSize,
      offset,
      searchq
    );

    const filtersUsed: IServiceResponse = {
      rows: services.data as unknown as IService[],
    };
    return {
      data: filtersUsed,
      totalItems: services.totalItems,
      currentPage: page,
      itemsPerPage: pageSize,
    };
  }

  @Get("/{id}")
  public static async getOne(@Path() id: string): Promise<IService> {
    return (await ServiceService.getOne(id)) as IService;
  }

  @Get("/all")
  public static async getNPaged(
    @Inject() institutionId: string | null
  ): Promise<IService[]> {
    return await ServiceService.getNPaged(institutionId);
  }

  @Post()
  public static async create(@Body() data: IServiceRequest): Promise<IService> {
    const result = await ServiceService.create(data);
    return result;
  }

  @Put("/{id}")
  public static async update(
    @Path() id: string,
    @Body() data: IServiceRequest
  ): Promise<boolean> {
    return await ServiceService.update(id, data);
  }

  @Delete("/{id}")
  public static async delete(@Path() id: string): Promise<boolean> {
    return await ServiceService.delete(id);
  }
}
