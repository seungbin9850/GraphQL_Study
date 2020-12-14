import { sign, verify } from "jsonwebtoken";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname + "../.env") });

export const generateAccessToken = async (id: number) => {
  return await sign({ id }, process.env.JWT_SECRET!, { expiresIn: "15m" });
};

export const generateRefreshToken = async (
  id: number,
  tokenVersion: number
) => {
  return await sign({ id, tokenVersion }, process.env.REFRESH_SECRET!, {
    expiresIn: "15d",
  });
};

export const verifyAccessToken = async (token: string) => {
  return await verify(token, process.env.JWT_SECRET!);
};

export const verifyRefreshToken = async (token: string) => {
  return await verify(token, process.env.REFRESH_SECRET!);
};
