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
  BelongsTo,
  BelongsToMany,
  ForeignKey,
  AllowNull,
  HasMany,
} from "sequelize-typescript";
import UserModel from "./UserModel";
import UserInstitutions from "./UserInstitutions";

@Table({
  tableName: "institutions",
  paranoid: false,
})
class InstitutionModel extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.UUID)
  name!: string;

  @Default("PHARMACY")
  @Column(DataType.UUID)
  institutionType!: string;

  @Column(DataType.JSON)
  admin!: Record<string, any>;

  @Column(DataType.JSON)
  details!: Record<string, any>;

  @ForeignKey(() => InstitutionModel)
  @AllowNull(false)
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

  @BelongsToMany(() => UserModel, () => UserInstitutions)
  users!: UserModel[];

  @BelongsTo(() => InstitutionModel)
  parentInstitution!: InstitutionModel;

  @HasMany(() => InstitutionModel)
  branches!: InstitutionModel[];
}

export default InstitutionModel;
