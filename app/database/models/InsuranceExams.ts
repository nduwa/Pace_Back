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
import ExamModel from "./ExamModel";

@Table({
  tableName: "insurance_exams",
  paranoid: false,
})
class InsuranceExams extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ExamModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  examId!: string;

  @BelongsTo(() => ExamModel, {
    onDelete: "RESTRICT",
    hooks: true,
  })
  exam!: ExamModel;

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

export default InsuranceExams;
