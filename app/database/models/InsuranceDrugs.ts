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
  Unique,
} from "sequelize-typescript";
import DrugModel from "./DrugModel";

@Table({
  tableName: "insurance_drugs",
  paranoid: false,
})
class InsuranceDrugs extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => DrugModel)
  @AllowNull(true)
  @Column(DataType.UUID)
  drugId!: string;

  @BelongsTo(() => DrugModel, {
    onDelete: "CASCADE",
    hooks: true,
  })
  drug!: DrugModel;

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

  @AllowNull(true)
  @Default(0)
  @Column(DataType.DOUBLE)
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
}

export default InsuranceDrugs;
