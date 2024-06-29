import { IExam } from "../type/exams";

export const examPrice = (exam: IExam) => {
  if (exam.institutionExam) {
    if (exam.institutionExam[0]) {
      return exam.institutionExam[0].price;
    }
  }

  return exam.price;
};
