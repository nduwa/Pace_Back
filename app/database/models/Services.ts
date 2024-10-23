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
  ForeignKey,
  BelongsTo,
  HasMany,
  AllowNull,
} from "sequelize-typescript";
import InstitutionModel from "./Institution";
import ServiceAct from "./ServiceAct";

@Table({
  tableName: "services",
  paranoid: true,
})
class Service extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING)
  label!: string;

  @Column(DataType.STRING)
  desc!: string;

  @Column(DataType.STRING)
  level!: string;

  @Column(DataType.BOOLEAN)
  assignDuringOrientation!: boolean;

  @AllowNull(true)
  @ForeignKey(() => InstitutionModel)
  @Column(DataType.UUID)
  institutionId!: string;

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

  @HasMany(() => ServiceAct)
  acts!: ServiceAct[];
}

export default Service;
