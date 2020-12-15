import { Request, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { User } from "../entity";

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.jid;
  if (!token) res.status(401).json({ ok: false, accessToken: "" });
  let payload: any = null;
  try {
    payload = await verifyRefreshToken(token);
  } catch (e) {
    res.status(401).json({ ok: false, accessToken: "" });
  }
  const { id, tokenVersion } = payload;
  const user: any = await User.findOne({ where: { id } });
  if (!user || user.tokenVersion !== tokenVersion)
    res.status(403).json({ ok: false, accessToken: "" });
  const newTokenVersion: any = user.tokenVersion + 1;
  res.cookie("jid", generateRefreshToken(user.id, newTokenVersion), {
    httpOnly: true,
  });
  Object.assign(user, { tokenVersion: newTokenVersion });
  await user.save();
  res
    .status(200)
    .json({ ok: true, accessToken: await generateAccessToken(user.id) });
};
