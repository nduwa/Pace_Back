import { IUser, UserReponse } from "./auth";

export interface IInstitution {
  id: string;
  name: string;
  institutionType: string;
  admin: {
    name: string;
    phone: string;
    email: string;
  };
  details: {
    location: string;
    TIN: string;
  };

  institutionId?: string | null;

  createdAt: Date;
}

export interface IInstitutionRequest
  extends Omit<IInstitution, "id" | "createdAt" | "institutionType"> {
  institutionType?: string | null;
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
}

export type IConsultationDTO = IConsultation;

export type IConsultationRequest = Pick<IConsultation, "price" | "label">;

export interface IConsultationResponse {
  rows: IConsultation[];
}
