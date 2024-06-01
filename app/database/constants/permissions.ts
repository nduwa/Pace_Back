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
    group: "EXAMS",
    permissions: ["VIEW_EXAMS", "UPDATE_EXAMS"],
  },
  {
    group: "SUDO",
    permissions: ["ALL_PERMISSIONS", "IMPORT_MEDECINES"],
  },
  {
    group: "ADMIN",
    permissions: ["INSTITUTION_ADMIN"],
  },
  {
    group: "MEDECINES",
    permissions: [
      "VIEW_MEDECINES",
      "UPDATE_MEDECINES",
      "PURCHASE_MEDECINES",
      "SERVE_MEDECINES",
    ],
  },
  {
    group: "INVOICES",
    permissions: ["VIEW_INVOICES"],
  },
  {
    group: "TRANSACTIONS",
    permissions: ["VIEW_TRANSACTIONS", "UPDATE_TRANSACTIONS"],
  },
  {
    group: "PATIENTS",
    permissions: ["VIEW_PATIENTS", "UPDATE_PATIENTS"],
  },
] as const;

const commonGroups = ["USERS", "TRANSACTIONS"];

export const permissionBasedOnInstitution = {
  PHARMACY: [...commonGroups, "MEDECINES", "PATIENTS"],
  CLINIC: [...commonGroups, "PATIENTS", "EXAMS"],
  INSURANCE: [...commonGroups, "MEDECINES"],
  ADMIN: [...commonGroups, "INSTITUTIONS", "PATIENTS", "EXAMS"],
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
