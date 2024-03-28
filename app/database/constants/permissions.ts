import { group } from "console";

const appPersmissions = [
  {
    group: "Institutions",
    permissions: ["VIEW_INSTITUTIONS", "UPDATE_INSTITUTIONS"],
  },
  {
    group: "Users",
    permissions: ["VIEW_USERS", "UPDATE_USERS", "CHANGE_USERS_PERMISSIONS"],
  },
  {
    group: "SUDO",
    permissions: ["ALL_PERMISSIONS"],
  },
  {
    group: "ADMIN",
    permissions: ["INSTITUTION_ADMIN"],
  },
] as const;

export type PermissionGroups = typeof appPersmissions;
export type PermissionGroup = PermissionGroups[number];
export type Permission = PermissionGroups[number]["permissions"][number];

export interface IPermissionGroup {
  group: string;
  permissions: Permission[];
}

export default appPersmissions;
