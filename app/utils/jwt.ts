import jwt, { JwtPayload } from "jsonwebtoken";
import VARIABLES from "../config/variables";

export const genToken = async (
  data: Record<string, string>
): Promise<string> => {
  return jwt.sign(data, VARIABLES.JWT_TOKEN, {
    expiresIn: VARIABLES.EXPIRE as number,
  });
};

export const verifyToken = async (
  data: string
): Promise<string | JwtPayload> => {
  return jwt.verify(data, VARIABLES.JWT_TOKEN);
};
