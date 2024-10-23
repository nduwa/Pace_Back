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
import InstitutionDrugs from "./InstututionDrugs";
import PatientsModel from "./PatientsModel";
import InsuranceDrugs from "./InsuranceDrugs";
import FormDrugs from "./FormDrugs";

@Table({
  tableName: "invoice_drugs",
  paranoid: true,
})
class InvoiceDrugsModel extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => DrugModel)
  @AllowNull(true)
  @Column(DataType.UUID)
  drugId!: string;

  @ForeignKey(() => FormDrugs)
  @AllowNull(true)
  @Default(true)
  @Column(DataType.UUID)
  formDrugId!: string;

  @ForeignKey(() => InstitutionDrugs)
  @AllowNull(false)
  @Column(DataType.UUID)
  institutionDrugId!: string;

  @ForeignKey(() => InsuranceDrugs)
  @AllowNull(true)
  @Column(DataType.UUID)
  insuranceDrugId!: string;

  @ForeignKey(() => PatientsModel)
  @AllowNull(true)
  @Column(DataType.UUID)
  patientId!: string;

  @BelongsTo(() => DrugModel)
  drug!: DrugModel;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  quantity!: number;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  unitPrice!: number;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  totalPrice!: number;

  @Column(DataType.FLOAT)
  patientCost!: number;

  @Column(DataType.FLOAT)
  insuranceCost!: number;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.BOOLEAN)
  isGiven!: boolean;

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

  @BelongsTo(() => InsuranceDrugs)
  insuranceDrug!: InsuranceDrugs;

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

export default InvoiceDrugsModel;
