import { IInstitution } from "./instutution";

export interface IDrugCategory {
  id: string;
  name: string;
  createdAt: Date;
}

export type IDrugCategoryRequest = Omit<IDrugCategory, "id" | "createdAt">;

export interface IDrugCategoryResponse {
  rows: IDrugCategory[];
}

export interface IDrug {
  id: string;
  drug_code: string;
  description: string;
  designation: string;
  instruction: string | null;
  drugCategory: string;
  isOnMarket: boolean;

  createdAt: Date;
  totalQuantity?: number;
}

export type IDrugRequest = Omit<IDrug, "id" | "createdAt" | "isOnMarket">;

export interface IDrugDTO extends IDrug {
  institution?: IInstitution;
}

export interface IDrugResponse {
  isOnMarket: string;
  drugCategory: string;
  rows: IDrugDTO[];
}

export interface IPurchaseDrugDTO {
  drug: string;
  qty: number;
  unitPrice: number;
  sellingPrice: number;
  batchNumber: string;
  expireDate: Date;
}
export interface ICreatePurchaseDTO {
  note: string;
  date: string;
  supplier: string;
  drugs: IPurchaseDrugDTO[];
}
export interface IPurchase {
  note?: string;
  date: Date;
  id: string;
  totalCost: number;
  supplier?: string;
  drugsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDrugPurchaseAdjust {
  id: string;
  batchNumber?: string | undefined | null;
  expireDate?: string | undefined | null;
}
export interface IAdjustPurchaseDTO {
  drugs: IDrugPurchaseAdjust[];
}

export interface IInstitutionDrug {
  id: string;
  drugId: string;
  institutionId: string;
  purchaseId: string;
  drugPurchaseId: string;
  batchNumber: string | null;
  expireDate: Date | null;
  itemNo: string;
  quantity: number;
  price: number;
  isAvailable: boolean;
  createdAt: Date;
  deletedAt: Date;
  updatedAt: Date;
}

export interface IDrugPurchase {
  id: string;
  drugId: string;
  institutionId: string;
  purchaseId: string;
  batchNumber: string | null;
  expireDate: Date | null;
  unitPrice: number;
  sellingPrice: number;
  totalPrice: number;
  quantity: number;

  createdAt: Date;
  deletedAt: Date;
  updatedAt: Date;

  drugs?: IInstitutionDrug[];
  drug?: IDrug;
  purchase?: IPurchase;
}

export interface IDrugPurchaseResponse {
  rows: IDrugPurchase[];
}
