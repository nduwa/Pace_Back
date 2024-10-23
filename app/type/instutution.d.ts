import { IUser, UserReponse } from "./auth";
import { IService } from "./service";

export interface IInstitution {
  id: string;
  name: string;
  institutionType: string;
  level: string;
  hasPharmacy: boolean;
  admin: {
    name: string;
    phone: string;
    email: string;
  };
  details: {
    location: string;
    TIN: string;
    percentage: number;
  };

  institutionId?: string | null;

  createdAt: Date;
}

export interface IInstitutionRequest
  extends Omit<
    IInstitution,
    "id" | "createdAt" | "institutionType" | "hasPharmacy" | "level"
  > {
  institutionType?: string | null;
  hasPharmacy?: boolean;
}

export interface IInstitutionDTO extends IInstitution {
  users?: UserReponse[];
  parentInstitution?: IInstitution;
  branches?: IInstitution[];
}

export interface IInstitutionResponse {
  type: string;
  rows: IInstitutionDTO[];
}

export interface ITransaction {
  id: string;
  userId: string;
  institutionId: string;
  amount: number;
  reason: string;
  reference: string;
  type: string;
}

export type ITransactionRequest = Omit<
  ITransaction,
  "id" | "userId" | "institutionId"
>;

export interface ITransactionDTO extends ITransaction {
  user: IUser;
  institution: IInstitution;
}

export interface ITransactionResponse {
  type: string;
  startDate: string;
  endDate: string;
  rows: ITransactionDTO[];
}

export interface ICreateBranch {
  name: string;
  location: string;
  details: {
    location: string;
    TIN: string;
    percentage: number;
  };
}

export interface IInstitutionResponse {
  type: string;
  rows: IInstitutionDTO[];
}

export interface IConsultation {
  id: string;
  institutionId: string;
  price: number;
  label: string;
  createdAt: Date;

  service?: IService;
}

export type IConsultationDTO = IConsultation;

export interface IConsultationRequest {
  services: { id?: string; serviceId: string }[];
}

export interface IConsultationResponse {
  rows: IConsultation[];
}
