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
} from "sequelize-typescript";
import InstitutionModel from "./Institution";
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

  @AllowNull(true)
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
