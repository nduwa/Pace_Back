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
import InstitutionModel from "./Institution";
import InvoiceModel from "./InvoiceModel";
import PatientsModel from "./PatientsModel";
import ServiceAct from "./ServiceAct";

@Table({
  tableName: "invoice_acts",
  paranoid: true,
})
class InvoiceActs extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ServiceAct)
  @AllowNull(false)
  @Column(DataType.UUID)
  serviceActId!: string;

  @ForeignKey(() => PatientsModel)
  @AllowNull(true)
  @Column(DataType.UUID)
  patientId!: string;

  @BelongsTo(() => ServiceAct)
  act!: ServiceAct;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  price!: number;

  @Column(DataType.FLOAT)
  patientCost!: number;

  @Column(DataType.FLOAT)
  insuranceCost!: number;

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

export default InvoiceActs;
