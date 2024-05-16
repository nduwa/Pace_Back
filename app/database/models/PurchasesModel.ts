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
  BeforeCreate,
} from "sequelize-typescript";
import DrugPurchasesModel from "./DrugPurchases";
import InstitutionModel from "./Institution";
import InstitutionDrugs from "./InstututionDrugs";
import { IPurchase } from "../../type/drugs";

@Table({
  tableName: "purchases",
  paranoid: false,
})
class PurchasesModel extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => InstitutionModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  institutionId!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  purchaseNO!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  note!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  supplier!: string;

  @AllowNull(true)
  @Default(false)
  @Column(DataType.BOOLEAN)
  approved!: boolean;

  @Column(DataType.DATE)
  date!: Date;

  @Column(DataType.INTEGER)
  drugsCount!: number;

  @Column(DataType.INTEGER)
  totalCost!: number;

  @HasMany(() => DrugPurchasesModel)
  drugs!: DrugPurchasesModel[];

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
  static async generateUniqueNumber(instance: IPurchase) {
    const latestItem = await PurchasesModel.findOne({
      order: [["purchaseNO", "DESC"]],
      attributes: ["purchaseNO"],
      raw: true,
    });

    let nextItemNo = 1;
    if (latestItem && latestItem.purchaseNO) {
      const lastNumber = parseInt(latestItem.purchaseNO, 10);
      nextItemNo = lastNumber + 1;
    }

    instance.purchaseNO = nextItemNo.toString().padStart(5, "0");
  }
}

export default PurchasesModel;
