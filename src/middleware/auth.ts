import { MiddlewareFn } from "type-graphql/dist/interfaces/Middleware";
import { Context } from "../dto/context";
import { verifyAccessToken } from "../utils/jwt";

export const isAuth: MiddlewareFn<Context> = async ({ context }, next) => {
  const { authorization } = context.req.headers;
  if (!authorization) throw new Error("not authenticated");
  try {
    const token = authorization.split(" ")[1];
    const payload = await verifyAccessToken(token);
    context.payload = payload as any;
  } catch (e) {
    throw new Error("not authenticated");
  }
  return next();
};
