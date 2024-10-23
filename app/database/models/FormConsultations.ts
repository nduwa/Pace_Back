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
import Consultations from "./Consultations";
import FormModel from "./FormModel";
import UserModel from "./UserModel";

@Table({
  tableName: "form_consultations",
  paranoid: true,
})
class FormConsultations extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => Consultations)
  @AllowNull(false)
  @Column(DataType.UUID)
  consultationId!: string;

  @ForeignKey(() => PatientsModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  patientId!: string;

  @ForeignKey(() => FormModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  formId!: string;

  @ForeignKey(() => UserModel)
  @AllowNull(true)
  @Default(null)
  @Column(DataType.UUID)
  userId!: string;

  @ForeignKey(() => UserModel)
  @AllowNull(true)
  @Default(null)
  @Column(DataType.UUID)
  sentBy!: string;

  @ForeignKey(() => InvoiceModel)
  @AllowNull(true)
  @Default(null)
  @Column(DataType.UUID)
  invoiceId!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  verdict!: string;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.FLOAT)
  price!: number;

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

  @BelongsTo(() => Consultations)
  consultation!: Consultations;

  @BelongsTo(() => UserModel, "userId")
  user!: UserModel;

  @BelongsTo(() => UserModel, "sentBy")
  sentByUser!: UserModel;
}

export default FormConsultations;
