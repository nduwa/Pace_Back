import { Op, UUIDV4 } from "sequelize";
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
  HasMany,
  BeforeCreate,
} from "sequelize-typescript";
import InvoiceModel from "./InvoiceModel";
import { IPatient } from "../../type/drugs";

@Table({
  tableName: "patients",
  timestamps: false,
})
class PatientsModel extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  phone!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  gender!: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  birthDate!: Date;

  @AllowNull(false)
  @Column(DataType.JSON)
  address!: Record<string, string>;

  @Unique
  @AllowNull(true)
  @Column(DataType.STRING)
  patientNO!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  NID!: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  NIDIndex!: number;

  @HasMany(() => InvoiceModel)
  invoices!: InvoiceModel[];

  @CreatedAt
  @Default(Sequelize.fn("NOW"))
  @Column(DataType.DATE)
  createdAt!: Date;

  @BeforeCreate
  static async generatePatientId(instance: IPatient) {
    const latestPatient = await PatientsModel.findOne({
      order: [["patientNO", "DESC"]],
    });

    let nextNumber = 1; // Default to 1 if no existing records
    let nextLetter = "A"; // Default to 'A'
    let nextLastLetter = "A"; // Default to 'A'
    let NIDIndex = 0; // Default to 0

    if (latestPatient) {
      const prevPatientId = latestPatient.patientNO;
      console.log(prevPatientId);
      const prevNumber = parseInt(prevPatientId.substring(2, 7), 10);
      const prevLastLetter = prevPatientId.substring(7);
      const prevLetter = prevPatientId.substring(1, 2);

      nextLetter = prevLetter;
      nextLastLetter = nextLastLetter;

      if (prevNumber === 99999) {
        if (prevLastLetter === "Z") {
          nextLetter = String.fromCharCode(prevLetter.charCodeAt(0) + 1);
          nextLastLetter = "A";
        } else {
          nextLastLetter = String.fromCharCode(
            prevLastLetter.charCodeAt(0) + 1
          );
        }
        nextNumber = 1;
      } else {
        nextNumber = prevNumber + 1;
        nextLetter = prevLetter;
        nextLastLetter = prevLastLetter;
      }
    }

    // Format the next sequential number with leading zeros
    const formattedNumber = nextNumber.toString().padStart(5, "0");

    // Generate the patient ID combining 'P', two letters, three digits, and another letter
    const patientNO = `P${nextLetter}${formattedNumber}${nextLastLetter}`;

    const NIDPatients = await PatientsModel.findAll({
      where: { NID: instance.NID, NIDIndex: { [Op.ne]: null } },
    });

    NIDIndex = NIDPatients.length;

    instance.patientNO = patientNO;
    instance.NIDIndex = NIDIndex as number;
  }
}

export default PatientsModel;
