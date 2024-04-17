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
} from "sequelize-typescript";
import DrugPurchasesModel from "./DrugPurchases";
import InstitutionModel from "./Institution";
import InstitutionDrugs from "./InstututionDrugs";

@Table({
  tableName: "purchases",
  paranoid: true,
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
  note!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  supplier!: string;

  @Column(DataType.DATE)
  date!: Date;

  @Column(DataType.INTEGER)
  drugsCount!: number;

  @Column(DataType.INTEGER)
  totalCost!: number;

  @HasMany(() => DrugPurchasesModel)
  drugs!: DrugPurchasesModel[];

  @HasMany(() => InstitutionDrugs)
  drugsList!: InstitutionDrugs[];

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

export default PurchasesModel;
