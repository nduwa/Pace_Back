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
} from "tsoa";

import { Paginations } from "../utils/DBHelpers";
import { IPaged } from "../type";
import InvoiceService from "../services/invoice.service";
import {
  ICreateInvoiceDTO,
  IInvoice,
  IInvoiceDTO,
  IInvoiceResponse,
} from "../type/drugs";

@Tags("Invoices")
@Route("api/invoices")
@Security("jwtAuth")
export class InvoiceController extends Controller {
  @Get()
  public static async getAll(
    @Inject() institutionId: string | null,
    @Inject() currentPage: number,
    @Inject() limit: number,
    @Inject() startDate: string | undefined,
    @Inject() endDate: string | undefined,
    @Inject() requester: string | undefined
  ): Promise<IPaged<IInvoiceResponse>> {
    const { page, pageSize, offset } = Paginations(currentPage, limit);
    const invoices = await InvoiceService.getAll(
      institutionId as string,
      pageSize,
      offset,
      startDate,
      endDate,
      requester
    );

    const filtersUsed: IInvoiceResponse = {
      startDate: startDate ?? "all",
      endDate: endDate ?? "all",
      requester: requester ?? "all",
      rows: invoices.data as unknown as IInvoice[],
    };
    return {
      data: filtersUsed,
      totalItems: invoices.totalItems,
      currentPage: page,
      itemsPerPage: pageSize,
    };
  }

  @Get("/{id}")
  public static async getOne(@Path() id: string): Promise<IInvoiceDTO | null> {
    return await InvoiceService.getOne(id);
  }

  @Post()
  public static async create(
    @Body() data: ICreateInvoiceDTO,
    @Inject() institutionId: string | null,
    @Inject() userId: string
  ): Promise<IInvoice> {
    const response = await InvoiceService.create(
      data,
      userId,
      institutionId as string
    );
    return response;
  }

  @Delete("/{id}")
  public static async delete(@Path() id: string): Promise<void> {
    return await InvoiceService.delete(id);
  }
}
