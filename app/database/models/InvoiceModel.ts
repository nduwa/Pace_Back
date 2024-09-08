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
  HasMany,
  ForeignKey,
  BelongsTo,
  BeforeCreate,
} from "sequelize-typescript";
import InstitutionModel from "./Institution";
import PatientsModel from "./PatientsModel";
import InvoiceDrugsModel from "./InvoiceDrugsModel";
import { IInvoice } from "../../type/drugs";
import UserModel from "./UserModel";
import FormModel from "./FormModel";
import InvoiceExams from "./InvoiceExams";
import InvoiceConsultations from "./InvoiceConsultations";

@Table({
  tableName: "invoices",
  paranoid: true,
})
class InvoiceModel extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => InstitutionModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  institutionId!: string;

  @ForeignKey(() => UserModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  userId!: string;

  @ForeignKey(() => PatientsModel)
  @AllowNull(true)
  @Column(DataType.UUID)
  patientId!: string;

  @ForeignKey(() => FormModel)
  @AllowNull(true)
  @Column(DataType.UUID)
  formId!: string;

  @ForeignKey(() => InstitutionModel)
  @AllowNull(true)
  @Column(DataType.UUID)
  insuranceId!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  note!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  name!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  phone!: string;

  @Column(DataType.FLOAT)
  totalCost!: number;

  @Column(DataType.FLOAT)
  patientCost!: number;

  @Column(DataType.FLOAT)
  insuranceCost!: number;

  @Default(true)
  @Column(DataType.BOOLEAN)
  published!: boolean;

  @Column(DataType.STRING)
  invoiceNO!: string;

  @AllowNull(true)
  @Default("PHARMACETICAL_RECORD")
  @Column(DataType.STRING)
  type!: string;

  @HasMany(() => InvoiceDrugsModel)
  drugs!: InvoiceDrugsModel[];

  @HasMany(() => InvoiceExams)
  exams!: InvoiceExams[];

  @HasMany(() => InvoiceConsultations)
  consultations!: InvoiceConsultations[];

  @BelongsTo(() => PatientsModel)
  patient!: PatientsModel;

  @BelongsTo(() => FormModel)
  form!: FormModel;

  @BelongsTo(() => UserModel)
  user!: UserModel;

  @BelongsTo(() => InstitutionModel, "institutionId")
  institution!: InstitutionModel;

  @BelongsTo(() => InstitutionModel, "insuranceId")
  insurance!: InstitutionModel;

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

  @BeforeCreate
  static async generateUniqueNumber(instance: IInvoice) {
    const latestItem = await InvoiceModel.findOne({
      order: [["invoiceNO", "DESC"]],
      attributes: ["invoiceNO"],
      raw: true,
    });

    let nextItemNo = 1;
    if (latestItem && latestItem.invoiceNO) {
      const lastNumber = parseInt(latestItem.invoiceNO, 10);
      nextItemNo = lastNumber + 1;
    }

    instance.invoiceNO = nextItemNo.toString().padStart(5, "0");
  }
}

export default InvoiceModel;
