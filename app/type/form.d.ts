import { IUser } from "./auth";
import {
  IDrug,
  IInstitutionDrug,
  IInsuranceDrug,
  IInvoice,
  IInvoiceDrug,
  IPatient,
} from "./drugs";
import { IExam } from "./exams";
import { IConsultation, IInstitution } from "./instutution";
import { IServiceAct } from "./service";

export interface IForm {
  id: string;
  institutionId: string;
  insuranceId: string | null;
  insuranceCard: string | null;
  patientId: string;
  formNO: string;
  at: string;
  from: string;
  isOpen: boolean;
  details: {
    temperature: number | null;
    weight: number | null;
    height: number | null;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface IFormResponse {
  isOpen: string;
  at: string;
  rows: IFormDTO[];
}

export interface IFormDTO extends IForm {
  patient?: IPatient;
  institution?: IInstitution;
  insurance?: IInstitution;
  drugs?: IFormDrugDTO[];
  acts?: IFormActDTO[];
  consultations?: IFormConsultationDTO[];
}

export interface IFormConsultation {
  id: string;
  consultationId: string;
  patientId: string;
  formId: string;
  userId: string | null;
  invoiceId: string | null;
  verdict: string;
  price: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface IFormConsultationDTO extends IFormConsultation {
  invoice?: IInvoice;
  consultation?: IConsultation;
  user?: IUser;
}

export interface IFormAct {
  id: string;
  examId: string;
  patientId: string;
  formId: string;
  userId: string | null;
  institutionId: string | null;
  invoiceId: string | null;
  result: boolean;
  comment: string;
  price: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface IFormActDTO extends IFormAct {
  invoice?: IInvoice;
  exam?: IExam;
  user?: IUser;
}

export interface IFormDrug {
  id: string;
  drugId: string;
  patientId: string;
  formId: string;
  userId: string | null;
  invoiceId: string | null;
  quantity: number;
  givenQuantitty: number;
  prescription: string;
  price: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface IFormDrugDTO extends IFormDrug {
  invoice?: IInvoice;
  drug?: IDrug;
  user?: IUser;
}

export interface IFormRequest
  extends Pick<
    IForm,
    "patientId" | "details" | "at" | "insuranceId" | "insuranceCard"
  > {}

export type FormAddDrug = {
  drugId: string;
  quantity: number;
  prescription: string;
  isMaterial?: boolean;
};

export type FormAddAct = {
  serviceActId: string;
  done: boolean;
  comment: string;
};
export type IFormConsultationRequest = {
  consultationId: string;
  verdict: string;
  drugs: FormAddDrug[];
  acts: FormAddAct[];
};

export type IFormPrescriptionRequest = Pick<IFormConsultationRequest, "drugs">;

export type IFormActRequest = {
  id: string;
  consultationId: string;
  acts: {
    serviceActId: string;
    done: boolean;
    comment: string;
  }[];
};

export type sendFormRequest = {
  to: string;
  acts?: [];
};

export type IInvoiceActData = {
  id: string;
  paid?: boolean;

  act?: any;
  price: number;
  patientCost: number;
  insuranceCost: number;
};

export type IInvoiceConsultationData = {
  id: string;
  consultation?: IConsultation;
  price: number;
};

export type IInvoiceDrugData = {
  id: string;
  paid: boolean;
  formDrugId?: string;
  drug?: IDrug;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  totalCost: number;
  patientCost: number;
  insuranceCost: number;
};

export interface IFormInvoiceData {
  invoice: IInvoice;
  form: IForm;
  invoiceConsultations: IInvoiceConsultationData[];
  invoiceActs: IInvoiceActData[];
  invoiceDrugs: IInvoiceDrugData[];
}

export interface IFormInvoiceRequest {
  invoiceConsultations: IInvoiceConsultationData[];
  invoiceActs: IInvoiceActData[];
  invoiceDrugs: IInvoiceDrugData[];
}

export type IdrugOnInvoice = {
  id: string;
  drug?: IDrug;
  insuranceDrug?: IInsuranceDrug;
  formDrug: IFormDrug;
  invoiceDrug: IInvoiceDrug;

  unitPrice: number;
  quantity: number;
  totalPrice: number;
  patientCost: number;
  insuranceCost: number;
};

export interface IAvailableMed {
  addToInvoice: {
    formDrugId: string;
    quantity: number;
    drug: IDrug;
    insuranceDrug?: IInsuranceDrug;

    formDrug: IFormDrug;
    drugsAvailable: IInstitutionDrug[];
  }[];

  alreadyOnInvoice: {
    invoice?: IInvoice | null;
    data: IdrugOnInvoice[];
  }[];
}

export interface IGiveDrugs {
  formId: string;
  drugIds: string[];
}
