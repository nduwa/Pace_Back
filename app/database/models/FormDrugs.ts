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
  @AllowNull(false)
  @Column(DataType.UUID)
  drugId!: string;

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

  @AllowNull(false)
  @Column(DataType.FLOAT)
  quantity!: number;

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
}

export default FormDrugs;
