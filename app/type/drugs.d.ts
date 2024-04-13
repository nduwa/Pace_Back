import { IInstitution } from "./instutution";

export interface IDrug {
  id: string;
  drug_code: string;
  description: string;
  designation: string;
  instruction: string | null;
  sellingUnit: string;
  price: number;
  isOnMarket: boolean;

  createdAt: Date;
}

export type IDrugRequest = Omit<IDrug, "id" | "createdAt" | "isOnMarket">;

export interface IDrugDTO extends IDrug {
  institution?: IInstitution;
}

export interface IDrugResponse {
  isOnMarket: string;
  sellingUnit: string;
  rows: IDrugDTO[];
}
