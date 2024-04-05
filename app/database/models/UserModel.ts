import { UUIDV4 } from "sequelize";
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
  BelongsToMany,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import PermissionModel from "./PermissionModel";
import UserInstitutions from "./UserInstitutions";
import InstitutionModel from "./Institution";
import RolesModel from "./RolesModel";
import UserRoles from "./UserRoles";

@Table({
  tableName: "users",
  timestamps: false,
})
class UserModel extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string;

  @AllowNull(false)
  @Unique(true)
  @Column(DataType.STRING)
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  phone!: string;

  @ForeignKey(() => InstitutionModel)
  @Column(DataType.UUID)
  institutionId!: string;

  @CreatedAt
  @Default(Sequelize.fn("NOW"))
  @Column(DataType.DATE)
  createdAt!: Date;

  @BelongsToMany(() => RolesModel, () => UserRoles)
  roles!: RolesModel[];

  @BelongsToMany(() => InstitutionModel, () => UserInstitutions)
  institutions!: InstitutionModel[];

  @BelongsTo(() => InstitutionModel)
  institution!: InstitutionModel;
}

export default UserModel;
