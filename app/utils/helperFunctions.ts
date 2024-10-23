import { IExam } from "../type/exams";
import { IServiceAct } from "../type/service";

export const examPrice = (exam: IExam) => {
  if (exam.institutionExam) {
    if (exam.institutionExam[0]) {
      return exam.institutionExam[0].price;
    }
  }

  return exam.price;
};

export const actPrice = (act: IServiceAct) => {
  if (act.institutionAct) {
    if (act.institutionAct[0]) {
      return act.institutionAct[0].price;
    }
  }

  return act.price;
};
