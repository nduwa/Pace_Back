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

  @ForeignKey(() => PatientsModel)
  @AllowNull(true)
  @Column(DataType.UUID)
  patientId!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  note!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  name!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  phone!: string;

  @Column(DataType.INTEGER)
  drugsCount!: number;

  @Column(DataType.INTEGER)
  totalCost!: number;

  @Column(DataType.STRING)
  invoiceNO!: string;

  @HasMany(() => InvoiceDrugsModel)
  drugs!: InvoiceDrugsModel[];

  @BelongsTo(() => PatientsModel)
  patient!: PatientsModel;

  @BelongsTo(() => InstitutionModel)
  institution!: InstitutionModel;

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