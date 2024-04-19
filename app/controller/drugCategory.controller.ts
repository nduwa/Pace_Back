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
import DrugCategoryService from "../services/drugCategory.service";
import {
  IDrugCategory,
  IDrugCategoryRequest,
  IDrugCategoryResponse,
} from "../type/drugs";

@Tags("Drugs")
@Route("api/drug-categories")
@Security("jwtAuth")
export class DrugCategoryController extends Controller {
  @Get("/")
  public static async getAll(
    @Inject() currentPage: number,
    @Inject() limit: number,
    @Inject() searchq: string | undefined
  ): Promise<IPaged<IDrugCategoryResponse>> {
    const { page, pageSize, offset } = Paginations(currentPage, limit);
    const institutions = await DrugCategoryService.getAll(
      pageSize,
      offset,
      searchq
    );

    const filtersUsed: IDrugCategoryResponse = {
      rows: institutions.data as unknown as IDrugCategory[],
    };
    return {
      data: filtersUsed,
      totalItems: institutions.totalItems,
      currentPage: page,
      itemsPerPage: pageSize,
    };
  }

  @Get("/{id}")
  public static async getOne(@Path() id: string): Promise<IDrugCategory> {
    return (await DrugCategoryService.getOne(id)) as IDrugCategory;
  }

  @Get("/all")
  public static async getNPaged(): Promise<IDrugCategory[]> {
    return await DrugCategoryService.getNPaged();
  }

  @Post()
  public static async create(
    @Body() data: IDrugCategoryRequest
  ): Promise<IDrugCategory> {
    const result = await DrugCategoryService.create(data);
    return result;
  }

  @Put("/{id}")
  public static async update(
    @Path() id: string,
    @Body() data: IDrugCategoryRequest
  ): Promise<boolean> {
    return await DrugCategoryService.update(id, data);
  }

  @Delete("/{id}")
  public static async delete(@Path() id: string): Promise<boolean> {
    return await DrugCategoryService.delete(id);
  }
}
