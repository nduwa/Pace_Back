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
  HasMany,
  ForeignKey,
  BelongsTo,
  BeforeCreate,
} from "sequelize-typescript";
import InstitutionModel from "./Institution";
import PatientsModel from "./PatientsModel";
import { IForm } from "../../type/form";
import FormDrugs from "./FormDrugs";
import ExamModel from "./ExamModel";
import FormConsultations from "./FormConsultations";
import FormExams from "./FormExams";

@Table({
  tableName: "forms",
  paranoid: true,
})
class FormModel extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => InstitutionModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  institutionId!: string;

  @ForeignKey(() => PatientsModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  patientId!: string;

  @ForeignKey(() => InstitutionModel)
  @AllowNull(true)
  @Column(DataType.UUID)
  insuranceId!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  insuranceCard!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  at!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  from!: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  isOpen!: boolean;

  @Column(DataType.JSON)
  details!: Record<string, any>;

  @Column(DataType.STRING)
  formNO!: string;

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

  @HasMany(() => FormDrugs)
  drugs!: FormDrugs[];

  @HasMany(() => FormExams)
  exams!: FormExams[];

  @HasMany(() => FormConsultations)
  consultations!: FormConsultations[];

  @BelongsTo(() => PatientsModel)
  patient!: PatientsModel;

  @BelongsTo(() => InstitutionModel, "insuranceId")
  insurance!: InstitutionModel;

  @BeforeCreate
  static async generateUniqueNumber(instance: IForm) {
    const latestItem = await FormModel.findOne({
      order: [["formNO", "DESC"]],
      attributes: ["formNO"],
      raw: true,
    });

    let nextItemNo = 1;
    if (latestItem && latestItem.formNO) {
      const lastNumber = parseInt(latestItem.formNO, 10);
      nextItemNo = lastNumber + 1;
    }

    instance.formNO = nextItemNo.toString().padStart(5, "0");
  }
}

export default FormModel;
