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
  HasMany,
} from "sequelize-typescript";
import InstitutionModel from "./Institution";
import InsuranceDrugs from "./InsuranceDrugs";

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

  @AllowNull(true)
  @Column(DataType.TEXT)
  description!: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  designation!: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  instruction!: string;

  @Column(DataType.STRING)
  drugCategory!: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  isOnMarket!: boolean;

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

  @HasMany(() => InsuranceDrugs)
  insuranceDrug!: InsuranceDrugs[];
}
export default DrugModel;
