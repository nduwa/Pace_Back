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
  purchaseNO?: string;
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

  totalQuantity?: number;
  drug?: IDrug;
}

export interface IPatient {
  id: string;
  name: string;
  phone: string;
  gender: string;
  birthDate: string | Date;
  address: {
    province: string;
    distict: string;
    sector: string;
    cell: string;
    village: string;
  };
  patientNO: string;
  NID: string;
  NIDIndex: number;
}

export interface IPatientRequest
  extends Omit<IPatient, "id" | "patientNO" | "NIDIndex"> {
  id?: string;
}

export interface IPatientDTO extends IPatient {
  invoices?: IInvoice[];
  dependents?: IPatient[];
}

export interface IPatientsResponse {
  rows: IPatientDTO[];
}

export interface IInvoice {
  id: string;
  patientId: string | null;
  institutionId: string;
  note: string;
  name: string;
  phone: string;
  invoiceNO: string;
  drugsCount: number;
  totalCost: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInvoiceDrug {
  id: string;
  patientId: string | null;
  institutionId: string;
  drugId: string;
  invoiceId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;

  drug?: IDrug;
}

export interface IInvoiceDTO extends IInvoice {
  patient?: IPatient;
  institution?: IInstitution;
  drugs?: IInvoiceDrug;
}

export interface IInvoiceResponse {
  rows: IInvoice[];
}

export interface IInvoiceDrugCreateDTO {
  drug: string;
  qty: number;
}
export interface ICreateInvoiceDTO {
  note: string;
  name: string;
  phone: string;
  patientId: string;
  drugs: IInvoiceDrugCreateDTO[];
}

export type UpdateNID = Pick<IPatientRequest, "NID">;

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

  drug?: IDrug;
  purchase?: IPurchase;
}

export interface IDrugPurchaseResponse {
  rows: IDrugPurchase[];
}

export interface IInstitutionDrugResponse {
  rows: IInstitutionDrug[];
}

export interface IInvoiceResponse {
  startDate: string;
  endDate: string;
  requester: string;
  rows: IInvoice[];
}
