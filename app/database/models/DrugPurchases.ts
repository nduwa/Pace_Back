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
import PurchasesModel from "./PurchasesModel";
import InstitutionDrugs from "./InstututionDrugs";
import InsuranceDrugs from "./InsuranceDrugs";

@Table({
  tableName: "drug_purchases",
  paranoid: true,
})
class DrugPurchasesModel extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => DrugModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  drugId!: string;

  @BelongsTo(() => DrugModel)
  drug!: DrugModel;

  @ForeignKey(() => InsuranceDrugs)
  @AllowNull(true)
  @Default(null)
  @Column(DataType.UUID)
  insuranceDrugId!: string;

  @BelongsTo(() => InsuranceDrugs)
  insuranceDrug!: InsuranceDrugs;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  quantity!: number;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  unitPrice!: number;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  sellingPrice!: number;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  totalPrice!: number;

  @AllowNull(true)
  @Column(DataType.TEXT)
  batchNumber!: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  expireDate!: Date;

  @ForeignKey(() => PurchasesModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  purchaseId!: string;

  @ForeignKey(() => InstitutionModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  institutionId!: string;

  @BelongsTo(() => InstitutionModel)
  institution!: InstitutionModel;

  @BelongsTo(() => PurchasesModel)
  purchase!: PurchasesModel;

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

export default DrugPurchasesModel;
