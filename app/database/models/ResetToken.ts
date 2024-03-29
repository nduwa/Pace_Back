import { Sequelize, UUIDV4 } from "sequelize";
import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
  PrimaryKey,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
} from "sequelize-typescript";
import UserModel from "./UserModel";

@Table({
  tableName: "reset_tokens",
  paranoid: false,
})
class ResetToken extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  userId!: string;

  @Column(DataType.STRING)
  token!: string;

  @Column(DataType.DATE)
  expiryDate!: Date;

  @BelongsTo(() => UserModel)
  user!: UserModel;

  @CreatedAt
  @Default(Sequelize.fn("now"))
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Default(Sequelize.fn("now"))
  @Column(DataType.DATE)
  updatedAt!: Date;

  @DeletedAt
  @Column(DataType.DATE)
  deletedAt!: Date;
}

export default ResetToken;
