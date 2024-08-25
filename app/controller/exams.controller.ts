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
import ExamService from "../services/exams.service";
import { IExam, IExamRequest, IExamResponse } from "../type/exams";
import { IPriceChange } from "../type/drugs";

@Tags("Exams")
@Route("api/exams")
@Security("jwtAuth")
export class ExamController extends Controller {
  @Get("/")
  public static async getAll(
    @Inject() institutionId: string | null,
    @Inject() currentPage: number,
    @Inject() limit: number,
    @Inject() searchq: string | undefined
  ): Promise<IPaged<IExamResponse>> {
    const { page, pageSize, offset } = Paginations(currentPage, limit);
    const exams = await ExamService.getAll(
      institutionId,
      pageSize,
      offset,
      searchq
    );

    const filtersUsed: IExamResponse = {
      rows: exams.data as unknown as IExam[],
    };
    return {
      data: filtersUsed,
      totalItems: exams.totalItems,
      currentPage: page,
      itemsPerPage: pageSize,
    };
  }

  @Get("/{id}")
  public static async getOne(@Path() id: string): Promise<IExam> {
    return (await ExamService.getOne(id)) as IExam;
  }

  @Get("/all")
  public static async getNPaged(
    @Inject() institutionId: string | null
  ): Promise<IExam[]> {
    return await ExamService.getNPaged(institutionId);
  }

  @Post()
  public static async create(@Body() data: IExamRequest): Promise<IExam> {
    const result = await ExamService.create(data);
    return result;
  }

  @Put("/{id}")
  public static async update(
    @Path() id: string,
    @Body() data: IExamRequest
  ): Promise<boolean> {
    return await ExamService.update(id, data);
  }

  @Delete("/{id}")
  public static async delete(@Path() id: string): Promise<boolean> {
    return await ExamService.delete(id);
  }

  @Put("/{id}/prices")
  public static async updatePrice(
    @Body() data: IPriceChange,
    @Inject() institutionId: string,
    @Path() id: string
  ): Promise<boolean> {
    return await ExamService.updatePrice(data, institutionId, id);
  }

  @Put("/{id}/insurance-prices")
  public static async updateInsurancePrice(
    @Body() data: IPriceChange,
    @Inject() institutionId: string,
    @Path() id: string
  ): Promise<boolean> {
    return await ExamService.updateInsurancePrice(data, institutionId, id);
  }
}
