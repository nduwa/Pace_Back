import { IUser } from "./auth";
import {
  IDrug,
  IInstitutionDrug,
  IInvoice,
  IInvoiceDrug,
  IPatient,
} from "./drugs";
import { IExam } from "./exams";
import { IConsultation, IInstitution } from "./instutution";

export interface IForm {
  id: string;
  institutionId: string;
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
  drugs?: IFormDrugDTO[];
  exams?: IFormExamDTO[];
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

export interface IFormExam {
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

export interface IFormExamDTO extends IFormExam {
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
  extends Pick<IForm, "patientId" | "details" | "at"> {}

export type FormAddDrug = {
  drugId: string;
  quantity: number;
  prescription: string;
};

export type FormAddExam = {
  examId: string;
};
export type IFormConsultationRequest = {
  consultationId: string;
  verdict: string;
  drugs: FormAddDrug[];
  exams: FormAddExam[];
};

export type IFormExamRequest = {
  id: string;
  exams: {
    examId: string;
    result: boolean;
    comment: string;
  }[];
};

export type sendFormRequest = {
  to: string;
};

export type IInvoiceExamData = {
  id: string;
  exam?: IExam;
  price: number;
};

export type IInvoiceConsultationData = {
  id: string;
  consultation?: IConsultation;
  price: number;
};

export type IInvoiceDrugData = {
  id: string;
  drug?: IDrug;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

export interface IFormInvoiceData {
  invoice: IInvoice;
  form: IForm;
  invoiceConsultations: IInvoiceConsultationData[];
  invoiceExams: IInvoiceExamData[];
  invoiceDrugs: IInvoiceDrugData[];
}

export interface IFormInvoiceRequest {
  invoiceConsultations: IInvoiceConsultationData[];
  invoiceExams: IInvoiceExamData[];
  invoiceDrugs: IInvoiceDrugData[];
}

export type IdrugOnInvoice = {
  id: string;
  drug?: IDrug;
  formDrug: IFormDrug;
  invoiceDrug: IInvoiceDrug;

  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

export interface IAvailableMed {
  addToInvoice: {
    formDrugId: string;
    quantity: number;
    drug: IDrug;
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
