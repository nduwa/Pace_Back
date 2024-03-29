import bcrypt from "bcrypt";
import crypto from "crypto";

export const encrypt = (plainPassword: string): string => {
  return bcrypt.hashSync(plainPassword, 10);
};
export const compare = (
  plainPassword: string,
  encryptedPassword: string
): boolean => {
  return bcrypt.compareSync(plainPassword, encryptedPassword);
};

export const generateResetToken = (): string => {
  return crypto.randomBytes(20).toString("hex");
};
