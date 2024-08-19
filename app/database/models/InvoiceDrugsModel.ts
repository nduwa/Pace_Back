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
  @AllowNull(false)
  @Column(DataType.UUID)
  drugId!: string;

  @ForeignKey(() => InstitutionDrugs)
  @AllowNull(false)
  @Column(DataType.UUID)
  institutionDrugId!: string;

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
