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
} from "sequelize-typescript";
import DrugModel from "./DrugModel";
import InstitutionModel from "./Institution";
import UserModel from "./UserModel";

@Table({
  tableName: "transactions",
  paranoid: false,
})
class Transactions extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => UserModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  userId!: string;

  @BelongsTo(() => UserModel)
  user!: DrugModel;

  @ForeignKey(() => InstitutionModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  institutionId!: string;

  @BelongsTo(() => InstitutionModel)
  institution!: InstitutionModel;

  @AllowNull(true)
  @Column(DataType.TEXT)
  reason!: string;

  @Min(0)
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  amount!: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  reference!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  type!: string;

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

export default Transactions;
