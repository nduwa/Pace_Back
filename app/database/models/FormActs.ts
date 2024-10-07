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
import InstitutionModel from "./Institution";
import ServiceAct from "./ServiceAct";
import FormConsultations from "./FormConsultations";

@Table({
  tableName: "form_acts",
  paranoid: true,
})
class FormActs extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ServiceAct)
  @AllowNull(false)
  @Column(DataType.UUID)
  serviceActId!: string;

  @ForeignKey(() => PatientsModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  patientId!: string;

  @ForeignKey(() => FormModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  formId!: string;

  @ForeignKey(() => FormConsultations)
  @AllowNull(false)
  @Column(DataType.UUID)
  formConsultationId!: string;

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
  done!: boolean;

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

  @BelongsTo(() => ServiceAct)
  act!: ServiceAct;
}

export default FormActs;
