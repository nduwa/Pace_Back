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
import UserModel from "./UserModel";
import RolesModel from "./RolesModel";

@Table({
  tableName: "user_roles",
  paranoid: false,
})
class UserRoles extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  userId!: string;

  @ForeignKey(() => RolesModel)
  @Column(DataType.UUID)
  roleId!: string;

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

  @BelongsTo(() => RolesModel)
  role!: RolesModel;
}

export default UserRoles;
