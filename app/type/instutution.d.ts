import { UserReponse } from "./auth";

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

  createdAt: Date;
}

export interface IInstitutionRequest
  extends Omit<IInstitution, "id" | "createdAt" | "institutionType"> {
  institutionType?: string | null;
}

export interface IInstitutionDTO extends IInstitution {
  users?: UserReponse[];
}

export interface IInstitutionResponse {
  type: string;
  rows: IInstitutionDTO[];
}
