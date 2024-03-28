import bcrypt from "bcrypt";

export const encrypt = (plainPassword: string): string => {
  return bcrypt.hashSync(plainPassword, 10);
};
export const compare = (
  plainPassword: string,
  encryptedPassword: string
): boolean => {
  return bcrypt.compareSync(plainPassword, encryptedPassword);
};
