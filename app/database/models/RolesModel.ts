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
  HasMany,
  BelongsToMany,
} from "sequelize-typescript";
import InstitutionModel from "./Institution";
import PermissionModel from "./PermissionModel";
import RolePermissions from "./RolePermissions";

@Table({
  tableName: "roles",
  paranoid: false,
})
class RolesModel extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING)
  label!: string;

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

  @BelongsTo(() => InstitutionModel)
  institution!: InstitutionModel;

  @BelongsToMany(() => PermissionModel, () => RolePermissions)
  permissions!: PermissionModel;
}

export default RolesModel;
