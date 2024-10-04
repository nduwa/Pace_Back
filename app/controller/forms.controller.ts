import {
  Route,
  Controller,
  Post,
  Tags,
  Body,
  Security,
  Inject,
  Get,
  Path,
  Delete,
  Put,
} from "tsoa";

import { Paginations } from "../utils/DBHelpers";
import { IPaged } from "../type";
import FormService from "../services/form.service";
import {
  IAvailableMed,
  IForm,
  IFormConsultationRequest,
  IFormDTO,
  IFormExamRequest,
  IFormInvoiceData,
  IFormInvoiceRequest,
  IFormRequest,
  IFormResponse,
  sendFormRequest,
} from "../type/form";
import { ICreateInvoiceDTO, IInvoice } from "../type/drugs";

@Tags("Forms")
@Route("api/forms")
@Security("jwtAuth")
export class FormController extends Controller {
  @Get()
  public static async getAll(
    @Inject() institutionId: string | null,
    @Inject() currentPage: number,
    @Inject() limit: number,
    @Inject() at: string | undefined,
    @Inject() isOpen: string | undefined
  ): Promise<IPaged<IFormResponse>> {
    const { page, pageSize, offset } = Paginations(currentPage, limit);
    const forms = await FormService.getAll(
      institutionId as string,
      pageSize,
      offset,
      at,
      isOpen
    );

    const filtersUsed: IFormResponse = {
      at: at ?? "all",
      isOpen: isOpen ?? "all",
      rows: forms.data as unknown as IFormDTO[],
    };
    return {
      data: filtersUsed,
      totalItems: forms.totalItems,
      currentPage: page,
      itemsPerPage: pageSize,
    };
  }

  @Get("by-location")
  public static async getAllByLocation(
    @Inject() institutionId: string | null,
    @Inject() at: string | undefined
  ): Promise<IFormDTO[]> {
    return await FormService.getAllByLocation(institutionId, at);
  }

  @Get("/{id}")
  public static async getOne(@Path() id: string): Promise<IFormDTO | null> {
    return await FormService.getOne(id);
  }

  @Post()
  public static async create(
    @Body() data: IFormRequest,
    @Inject() institutionId: string | null
  ): Promise<IForm> {
    const response = await FormService.create(institutionId as string, data);
    return response;
  }

  @Put("/{id}")
  public static async update(
    @Body() data: IFormRequest,
    @Path() id: string
  ): Promise<boolean> {
    return await FormService.update(id, data);
  }

  @Delete("/{id}")
  public static async delete(@Path() id: string): Promise<number> {
    return await FormService.delete(id);
  }

  @Delete("/invoice-drug/{id}")
  public static async removeDrugFromInvoice(@Path() id: string): Promise<void> {
    return await FormService.removeDrugFromInvoice(id);
  }

  @Post("/{id}/consultation")
  public static async consultation(
    @Body() data: IFormConsultationRequest,
    @Path() id: string,
    @Inject() userId: string
  ): Promise<IFormDTO> {
    return await FormService.consultation(data, id, userId);
  }

  @Post("/{id}/examination")
  public static async examination(
    @Body() data: IFormExamRequest,
    @Path() id: string,
    @Inject() userId: string,
    @Inject() institutionId: string
  ): Promise<IFormDTO> {
    return await FormService.examination(data, id, userId, institutionId);
  }

  @Post("/{id}/send-form")
  public static async sendForm(
    @Body() data: sendFormRequest,
    @Path() id: string
  ): Promise<number> {
    return await FormService.sendFormTo(id, data);
  }

  @Get("/locations")
  public static async getLocations(
    @Inject() institutionId: string | null
  ): Promise<string[]> {
    return await FormService.getLocations(institutionId as string);
  }

  @Post("/{id}/invoice-drugs")
  public static async invoiceDrugs(
    @Body() data: ICreateInvoiceDTO,
    @Inject() institutionId: string | null,
    @Inject() userId: string
  ): Promise<IInvoice> {
    const response = await FormService.invoiceDrugs(
      data,
      userId,
      institutionId as string
    );
    return response;
  }

  @Get("/{id}/make-invoice")
  public static async possibleToBeInvoiced(
    @Path() id: string,
    @Inject() institutionId: string | null,
    @Inject() userId: string
  ): Promise<IFormInvoiceData> {
    const response = await FormService.possibleTobeInvoiced(
      id,
      institutionId as string,
      userId
    );
    return response;
  }

  @Post("/{id}/save-invoice")
  public static async saveInvoice(
    @Path() id: string,
    @Body() data: IFormInvoiceRequest
  ): Promise<boolean> {
    const response = await FormService.saveInvoice(data, id);
    return response;
  }

  @Get("/{id}/available-med")
  public static async getAvailableMedForForm(
    @Path() id: string,
    @Inject() institutionId: string | null
  ): Promise<IAvailableMed> {
    const response = await FormService.getAvailableMedForForm(
      id,
      institutionId as string
    );
    return response;
  }
}
