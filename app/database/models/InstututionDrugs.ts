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
  Min,
  Unique,
  BeforeBulkCreate,
} from "sequelize-typescript";
import DrugModel from "./DrugModel";
import InstitutionModel from "./Institution";
import PurchasesModel from "./PurchasesModel";
import DrugPurchasesModel from "./DrugPurchases";

@Table({
  tableName: "institution_drugs",
  paranoid: true,
})
class InstitutionDrugs extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => DrugModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  drugId!: string;

  @BelongsTo(() => DrugModel, {
    onDelete: "RESTRICT",
    hooks: true,
  })
  drug!: DrugModel;

  @ForeignKey(() => InstitutionModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  institutionId!: string;

  @BelongsTo(() => InstitutionModel)
  institution!: InstitutionModel;

  @ForeignKey(() => PurchasesModel)
  @AllowNull(true)
  @Column(DataType.UUID)
  purchaseId!: string;

  @BelongsTo(() => PurchasesModel)
  purchase!: PurchasesModel;

  @ForeignKey(() => DrugPurchasesModel)
  @AllowNull(true)
  @Column(DataType.UUID)
  drugPurchaseId!: string;

  @BelongsTo(() => DrugPurchasesModel)
  drugPurchase!: DrugPurchasesModel;

  @AllowNull(true)
  @Column(DataType.TEXT)
  batchNumber!: string;

  @Min(0)
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  quantity!: number;

  @AllowNull(true)
  @Unique(true)
  @Column(DataType.STRING)
  itemNo!: string;

  @AllowNull(true)
  @Column(DataType.DOUBLE)
  price!: number;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  isAvailable!: boolean;

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

  @BeforeBulkCreate
  static async generateUniqueNumber(instances: InstitutionDrugs[]) {
    const latestItem = await InstitutionDrugs.findOne({
      order: [["itemNo", "DESC"]],
      attributes: ["itemNo"],
      raw: true,
    });

    let nextItemNo = 1;
    if (latestItem && latestItem.itemNo) {
      const lastNumber = parseInt(latestItem.itemNo, 10);
      nextItemNo = lastNumber + 1;
    }

    instances.forEach((instance, index) => {
      instance.itemNo = (nextItemNo + index).toString().padStart(5, "0");
    });
  }
}

export default InstitutionDrugs;