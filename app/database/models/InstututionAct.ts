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
import ServiceAct from "./ServiceAct";

@Table({
  tableName: "institution_acts",
  paranoid: false,
})
class InstitutionAct extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ServiceAct)
  @AllowNull(false)
  @Column(DataType.UUID)
  serviceActId!: string;

  @BelongsTo(() => ServiceAct, {
    onDelete: "CASCADE",
    hooks: true,
  })
  act!: ServiceAct;

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

export default InstitutionAct;
