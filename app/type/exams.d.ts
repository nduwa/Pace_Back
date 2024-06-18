export interface IExamResponse {
  rows: IExam[];
}

export interface IExam {
  id: string;
  exam_code: string;
  description: string;
  name: string;
  price: number;
  createdAt: Date;
}

export type IExamRequest = Omit<IExam, "id" | "createdAt" | "isOnMarket">;
