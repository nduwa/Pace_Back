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
} from "sequelize-typescript";
import InstitutionModel from "./Institution";
import Service from "./Services";

@Table({
  tableName: "consultations",
  paranoid: true,
})
class Consultations extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @Default(null)
  @Column(DataType.STRING)
  label!: string;

  @Default(0)
  @Column(DataType.FLOAT)
  price!: number;

  @ForeignKey(() => InstitutionModel)
  @Column(DataType.UUID)
  institutionId!: string;

  @ForeignKey(() => Service)
  @Column(DataType.UUID)
  serviceId!: string;

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

  @BelongsTo(() => Service)
  service!: Service;
}

export default Consultations;
