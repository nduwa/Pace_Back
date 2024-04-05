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
import RolesModel from "./RolesModel";

@Table({
  tableName: "role_permissions",
  paranoid: false,
})
class RolePermissions extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => PermissionModel)
  @Column(DataType.UUID)
  permissionId!: string;

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

  @BelongsTo(() => PermissionModel)
  permission!: PermissionModel;
}

export default RolePermissions;
