import { IInstitution } from "./instutution";

export interface IService {
  id: string;
  label: string;
  desc: string;
  level: string;
  assignDuringOrientation: boolean;
  institutionId: string;
  createdAt: Date;

  acts?: IServiceAct[];
  institution?: IInstitution;
}

export interface IServiceAct {
  id: string;
  label: string;
  desc: string;
  price: number;
  serviceId: string;
  institutionId: string;
  createdAt: Date;

  service?: IService;
  institution?: IInstitution;
  institutionAct?: IInstitutionAct[];
}

export interface IServiceRequest
  extends Pick<
    IService,
    "label" | "desc" | "level" | "assignDuringOrientation"
  > {
  id?: string;
}

export interface IServiceActRequest
  extends Pick<IServiceAct, "label" | "desc" | "price" | "serviceId"> {
  id?: string;
}

export interface IInstitutionAct {
  id: string;
  institutionId: string;
  serviceActId: string;
  price: number;
  createdAt: Date;
}

export interface IServiceResponse {
  rows: IService[];
}

export interface IServiceActResponse {
  rows: IServiceAct[];
}
