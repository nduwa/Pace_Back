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
import PermissionModel from "./PermissionModel";
import UserModel from "./UserModel";
import InstitutionModel from "./Institution";

@Table({
  tableName: "users_institutions",
  paranoid: false,
})
class UserInstitutions extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  userId!: string;

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

  @BelongsTo(() => UserModel)
  user!: UserModel;

  @BelongsTo(() => InstitutionModel)
  institution!: InstitutionModel;
}

export default UserInstitutions;
