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
    group: "SERVCES",
    permissions: ["VIEW_SERVICES", "UPDATE_SERVICES"],
  },
  {
    group: "INSURANCE",
    permissions: ["INSURANCE_PRICES", "VIEW_MEDECINES", "VIEW_EXAMS"],
  },
  {
    group: "SUDO",
    permissions: ["ALL_PERMISSIONS", "IMPORT_MEDECINES", "IMPORT_EXAMS"],
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
    group: "CLINIC",
    permissions: [
      "CONSULTATION",
      "PHARMACY",
      "LABORATORY",
      "COUNTER",
      "RECEIPTION",
    ],
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
  CLINIC: [...commonGroups, "PATIENTS", "EXAMS", "CLINIC", "SERVICES"],
  INSURANCE: [...commonGroups, "INSURANCE"],
  ADMIN: [...commonGroups, "INSTITUTIONS", "PATIENTS", "EXAMS", "SERVICES"],
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
