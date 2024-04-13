import { UUIDV4 } from "sequelize";
import {
  Table,
  Default,
  AllowNull,
  Unique,
  PrimaryKey,
  Model,
  Column,
  DataType,
  Sequelize,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import InstitutionModel from "./Institution";

@Table({
  tableName: "drugs",
})
class DrugModel extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(true)
  @ForeignKey(() => InstitutionModel)
  @Column(DataType.UUID)
  institutionId!: string;

  @AllowNull(false)
  @Unique(true)
  @Column(DataType.STRING)
  drug_code!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column(DataType.TEXT)
  designation!: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  instruction!: string;

  @Column(DataType.STRING)
  sellingUnit!: string;

  @Column(DataType.DOUBLE)
  price!: number;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  isOnMarket!: number;

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

  @BelongsTo(() => InstitutionModel)
  institution!: InstitutionModel;
}
export default DrugModel;
