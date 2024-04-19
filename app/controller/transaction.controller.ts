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
import TransactionService from "../services/transaction.service";
import {
  ITransaction,
  ITransactionDTO,
  ITransactionRequest,
  ITransactionResponse,
} from "../type/instutution";

@Tags("Users")
@Route("api/transactions")
@Security("jwtAuth")
export class TransactionController extends Controller {
  @Get()
  public static async getAll(
    @Inject() institutionId: string | null,
    @Inject() currentPage: number,
    @Inject() limit: number,
    @Inject() searchq: string | undefined,
    @Inject() type: string | undefined
  ): Promise<IPaged<ITransactionResponse>> {
    const { page, pageSize, offset } = Paginations(currentPage, limit);
    const transactions = await TransactionService.getAll(
      institutionId,
      pageSize,
      offset,
      searchq,
      type
    );

    const filtersUsed: ITransactionResponse = {
      type: type ?? "all",
      rows: transactions.data as unknown as ITransactionDTO[],
    };
    return {
      data: filtersUsed,
      totalItems: transactions.totalItems,
      currentPage: page,
      itemsPerPage: pageSize,
    };
  }

  @Get("/{id}")
  public static async getOne(@Path() id: string): Promise<ITransactionDTO> {
    return await TransactionService.getOne(id);
  }

  @Post()
  public static async create(
    @Body() data: ITransactionRequest,
    @Inject() institutionId: string | null,
    @Inject() userId: string
  ): Promise<ITransaction> {
    const response = await TransactionService.create(
      userId,
      institutionId,
      data
    );
    return response;
  }

  @Put("/{id}")
  public static async update(
    @Path() id: string,
    @Body() data: ITransactionRequest
  ): Promise<boolean> {
    return await TransactionService.update(id, data);
  }

  @Delete("/{id}")
  public static async delete(@Path() id: string): Promise<number> {
    return await TransactionService.delete(id);
  }

  @Get("/all")
  public static async all(
    @Inject() institutionId: string | null
  ): Promise<ITransactionDTO[]> {
    return await TransactionService.getAllNPaged(institutionId);
  }
}
