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
  AllowNull,
  HasMany,
} from "sequelize-typescript";
import Service from "./Services";
import InstitutionAct from "./InstututionAct";
import InstitutionModel from "./Institution";

@Table({
  tableName: "acts",
  paranoid: false,
})
class ServiceAct extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING)
  label!: string;

  @Column(DataType.STRING)
  desc!: string;

  @Column(DataType.FLOAT)
  price!: number;

  @AllowNull(true)
  @ForeignKey(() => Service)
  @Column(DataType.UUID)
  serviceId!: string;

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

  @BelongsTo(() => Service)
  service!: Service;

  @HasMany(() => InstitutionAct)
  institutionAct!: InstitutionAct[];
}

export default ServiceAct;
