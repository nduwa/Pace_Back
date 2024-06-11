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
  HasMany,
} from "sequelize-typescript";
import DrugModel from "./DrugModel";
import InstitutionModel from "./Institution";
import InvoiceModel from "./InvoiceModel";
import PatientsModel from "./PatientsModel";
import ExamModel from "./ExamModel";

@Table({
  tableName: "invoice_exams",
  paranoid: true,
})
class InvoiceExams extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ExamModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  examId!: string;

  @ForeignKey(() => PatientsModel)
  @AllowNull(true)
  @Column(DataType.UUID)
  patientId!: string;

  @BelongsTo(() => ExamModel)
  exam!: ExamModel;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  price!: number;

  @ForeignKey(() => InvoiceModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  invoiceId!: string;

  @ForeignKey(() => InstitutionModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  institutionId!: string;

  @BelongsTo(() => InstitutionModel)
  institution!: InstitutionModel;

  @BelongsTo(() => InvoiceModel)
  invoice!: InvoiceModel;

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
}

export default InvoiceExams;
