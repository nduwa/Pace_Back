import { group } from "console";

const appPersmissions = [
  {
    group: "INSTITUTIONS",
    permissions: ["VIEW_INSTITUTIONS", "UPDATE_INSTITUTIONS"],
  },
  {
    group: "USERS",
    permissions: ["VIEW_USERS", "UPDATE_USERS"],
  },
  {
    group: "SUDO",
    permissions: ["ALL_PERMISSIONS"],
  },
  {
    group: "ADMIN",
    permissions: ["INSTITUTION_ADMIN"],
  },
  {
    group: "MEDECINES",
    permissions: ["VIEW_MEDECINES", "UPDATE_MEDECINES"],
  },
  {
    group: "PATIENTS",
    permissions: ["VIEW_PATIENTS", "UPDATE_PATIENTS"],
  },
] as const;

export const permissionBasedOnInstitution = {
  PHARMACY: ["USERS", "MEDECINES"],
  CLINIC: ["USERS", "PATIENTS"],
  INSURANCE: ["USERS", "MEDECINES"],
  ADMIN: ["USERS", "INSTITUTIONS"],
};

export type PermissionGroups = typeof appPersmissions;
export type PermissionGroup = PermissionGroups[number];
export type Permission = PermissionGroups[number]["permissions"][number];

export const superAdminPermissions = (
  appPersmissions.find(
    (permissions) => permissions.group === "INSTITUTIONS"
  ) || {
    permissions: [],
  }
).permissions;
export interface IPermissionGroup {
  group: string;
  permissions: Permission[];
}

export default appPersmissions;
