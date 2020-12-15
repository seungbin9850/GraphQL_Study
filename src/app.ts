import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { UserResolver, PostResolver } from "./resolvers";
import * as cors from "cors";
import * as cookieParser from "cookie-parser";
import { refreshToken } from "./controller/refresh";

const main = async () => {
  await createConnection();
  const schema = await buildSchema({
    resolvers: [UserResolver, PostResolver],
  });
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });
  const app = Express();
  apolloServer.applyMiddleware({ app });

  app.use(cors({ credentials: true, origin: true }));
  app.use(cookieParser());

  app.post("/refresh", refreshToken);

  app.listen(3000, () => {
    console.log("server start at http://localhost:3000/graphql");
  });
};

main();
