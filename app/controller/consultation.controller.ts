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
import ConsultationService from "../services/consultation.service";
import {
  IConsultation,
  IConsultationDTO,
  IConsultationRequest,
  IConsultationResponse,
} from "../type/instutution";

@Tags("Users")
@Route("api/consultations")
@Security("jwtAuth")
export class ConsultationController extends Controller {
  @Get()
  public static async getAll(
    @Inject() institutionId: string | null,
    @Inject() currentPage: number,
    @Inject() limit: number,
    @Inject() searchq: string | undefined
  ): Promise<IPaged<IConsultationResponse>> {
    const { page, pageSize, offset } = Paginations(currentPage, limit);
    const consultations = await ConsultationService.getAll(
      institutionId,
      pageSize,
      offset,
      searchq
    );

    const filtersUsed: IConsultationResponse = {
      rows: consultations.data as unknown as IConsultationDTO[],
    };
    return {
      data: filtersUsed,
      totalItems: consultations.totalItems,
      currentPage: page,
      itemsPerPage: pageSize,
    };
  }

  @Get("/{id}")
  public static async getOne(@Path() id: string): Promise<IConsultationDTO> {
    return await ConsultationService.getOne(id);
  }

  @Post()
  public static async create(
    @Body() data: IConsultationRequest,
    @Inject() institutionId: string | null
  ): Promise<boolean> {
    const response = await ConsultationService.assignServices(
      institutionId,
      data
    );
    return response;
  }

  @Put("/{id}")
  public static async update(
    @Path() id: string,
    @Body() data: IConsultationRequest
  ): Promise<boolean> {
    return await ConsultationService.update(id, data);
  }

  @Delete("/{id}")
  public static async delete(@Path() id: string): Promise<number> {
    return await ConsultationService.delete(id);
  }

  @Get("/all")
  public static async all(
    @Inject() institutionId: string | null
  ): Promise<IConsultationDTO[]> {
    return await ConsultationService.getAllNPaged(institutionId);
  }
}
