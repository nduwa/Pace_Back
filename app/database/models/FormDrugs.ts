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
import PatientsModel from "./PatientsModel";
import FormModel from "./FormModel";
import DrugModel from "./DrugModel";
import InvoiceModel from "./InvoiceModel";
import FormConsultations from "./FormConsultations";
import InsuranceDrugs from "./InsuranceDrugs";
import InstitutionDrugs from "./InstututionDrugs";

@Table({
  tableName: "form_drugs",
  paranoid: true,
})
class FormDrugs extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => DrugModel)
  @AllowNull(true)
  @Column(DataType.UUID)
  drugId!: string;

  @ForeignKey(() => InstitutionDrugs)
  @AllowNull(true)
  @Column(DataType.UUID)
  institutionDrugId!: string;

  @ForeignKey(() => InsuranceDrugs)
  @AllowNull(true)
  @Column(DataType.UUID)
  insuranceDrugId!: string;

  @ForeignKey(() => PatientsModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  patientId!: string;

  @ForeignKey(() => FormModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  formId!: string;

  @ForeignKey(() => InvoiceModel)
  @AllowNull(true)
  @Default(null)
  @Column(DataType.UUID)
  invoiceId!: string;

  @ForeignKey(() => FormConsultations)
  @AllowNull(true)
  @Column(DataType.UUID)
  formConsultationId!: string;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  quantity!: number;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isMaterial!: boolean;

  @Column(DataType.STRING)
  prescription!: string;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.FLOAT)
  givenQuantity!: number;

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

  @BelongsTo(() => DrugModel)
  drug!: DrugModel;

  @BelongsTo(() => InsuranceDrugs)
  insuranceDrug!: InsuranceDrugs;
}

export default FormDrugs;
