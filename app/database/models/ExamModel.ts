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
  Unique,
  HasMany,
} from "sequelize-typescript";
import InstitutionExams from "./InstututionExams";
import InsuranceExams from "./InsuranceExams";

@Table({
  tableName: "exams",
  paranoid: true,
})
class ExamModel extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @Column(DataType.STRING)
  exam_code!: string;

  @Column(DataType.TEXT)
  name!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column(DataType.FLOAT)
  price!: number;

  @DeletedAt
  @Column(DataType.DATE)
  deletedAt!: Date;

  @HasMany(() => InstitutionExams)
  institutionExam!: InstitutionExams[];

  @HasMany(() => InsuranceExams)
  insuranceExam!: InsuranceExams[];

  @CreatedAt
  @Default(Sequelize.fn("NOW"))
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Default(Sequelize.fn("NOW"))
  @Column(DataType.DATE)
  updatedAt!: Date;
}

export default ExamModel;
