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
  IPatient,
  IPatientDTO,
  IPatientRequest,
  IPatientsResponse,
} from "../type/drugs";
import PatientService from "../services/patients.service";

@Tags("Users")
@Route("api/patients")
@Security("jwtAuth")
export class PatientController extends Controller {
  @Get()
  public static async getAll(
    @Inject() currentPage: number,
    @Inject() limit: number,
    @Inject() searchq: string | undefined
  ): Promise<IPaged<IPatientsResponse>> {
    const { page, pageSize, offset } = Paginations(currentPage, limit);
    const patients = await PatientService.getAll(pageSize, offset, searchq);

    const filtersUsed: IPatientsResponse = {
      rows: patients.data as unknown as IPatientDTO[],
    };
    return {
      data: filtersUsed,
      totalItems: patients.totalItems,
      currentPage: page,
      itemsPerPage: pageSize,
    };
  }

  @Get("/{id}")
  public static async getOne(@Path() id: string): Promise<IPatientDTO> {
    return await PatientService.getOne(id);
  }

  @Post()
  public static async create(@Body() data: IPatientRequest): Promise<IPatient> {
    const response = await PatientService.create(data);
    return response;
  }

  @Put("/{id}")
  public static async update(
    @Path() id: string,
    @Body() data: IPatientRequest
  ): Promise<boolean> {
    return await PatientService.update(id, data);
  }

  @Post("/{id}")
  public static async addDependent(
    @Path() id: string,
    @Body() data: IPatientRequest
  ): Promise<IPatient> {
    return await PatientService.addDependant(id, data);
  }

  @Delete("/{id}")
  public static async delete(@Path() id: string): Promise<number> {
    return await PatientService.delete(id);
  }

  @Get("/all")
  public static async all(
    @Inject() searchq: string | undefined
  ): Promise<IPatientDTO[]> {
    return await PatientService.getAllNPaged(searchq);
  }
}
