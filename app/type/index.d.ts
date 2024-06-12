import { IUser } from "./auth";
import { IInstitution } from "./instutution";

export interface IPaged<T> {
  data: T;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface Paged<T> {
  data: T;
  totalItems: number;
}

export interface IDashboard {
  drugsCount: number;
  drugsInStock: number;
  examsCount: number;
  institutionsCount: number;
  institutionBranchesCount: number;
}

export interface IDashboardTransactions {
  income: number;
  expense: number;
  purchased: number;
  invoiced: number;
}
