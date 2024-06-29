import { UUIDV4 } from "sequelize";
import {
  Table,
  Model,
  Column,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  Sequelize,
  DataType,
  DeletedAt,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import InvoiceModel from "./InvoiceModel";
import PatientsModel from "./PatientsModel";
import FormModel from "./FormModel";
import UserModel from "./UserModel";
import ExamModel from "./ExamModel";
import InstitutionModel from "./Institution";

@Table({
  tableName: "form_exams",
  paranoid: true,
})
class FormExams extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ExamModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  examId!: string;

  @ForeignKey(() => PatientsModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  patientId!: string;

  @ForeignKey(() => FormModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  formId!: string;

  @ForeignKey(() => InstitutionModel)
  @AllowNull(true)
  @Default(null)
  @Column(DataType.UUID)
  institutionId!: string;

  @ForeignKey(() => InvoiceModel)
  @AllowNull(true)
  @Default(null)
  @Column(DataType.UUID)
  invoiceId!: string;

  @AllowNull(true)
  @Column(DataType.BOOLEAN)
  result!: boolean;

  @Column(DataType.STRING)
  comment!: string;

  @DeletedAt
  @Column(DataType.DATE)
  deletedAt!: Date;

  @CreatedAt
  @Default(Sequelize.fn("NOW"))
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Default(Sequelize.fn("NOW"))
  @Column(DataType.DATE)
  updatedAt!: Date;

  @BelongsTo(() => InvoiceModel)
  invoice!: InvoiceModel;

  @BelongsTo(() => ExamModel)
  exam!: ExamModel;
}

export default FormExams;
