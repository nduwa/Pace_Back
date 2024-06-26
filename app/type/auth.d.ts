import { IInstitution } from "./instutution";

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  institutionId: string | null;
  password: string;
  createdAt: Date;
}

export interface IPermission {
  id: string;
  label: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UserPermission = Pick<IPermission, "id" | "label">;

export interface IUserWithPermissions extends IUser {
  permissions: UserPermission[];
  institutions: IInstitution[];
  roles: IRole[];
  institution: IInstitution;
}

export interface UserReponse
  extends Omit<IUser, "deletedAt" | "updatedAt" | "password"> {}

export interface ILogin extends Pick<IUser, "email" | "password"> {}

export interface IJWTPayload {
  user?: IUser;
  accessToken: string;
}

export interface IRegister
  extends Pick<IUser, "name" | "email" | "password" | "phone"> {}

export interface IResetPasswordRequest {
  email: string;
}

export interface IResetPassword {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface IUpdateUser extends Omit<IRegister, "password"> {}

export interface ICreateUser extends Omit<IRegister, "password"> {}

export interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface INewUserDTO extends UserReponse {
  password: string;
}

export interface IUsersResponse {
  rows: IUserWithPermissions[];
}
export interface IRole {
  id: string;
  label: string;
  institutionId: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRoleRequest extends Pick<IRole, "label"> {
  permissions?: string[];
}
export interface RoleResponseDTO extends IRole {
  permissions: IPermission[];
}

export interface IAssignPermissionsRequest {
  id: string;
  roles?: string[];
}

export interface RoleResponseDTO extends IRole {
  permissions: IPermission[];
}

export interface ChangeInstitution {
  institutionId: string;
}
