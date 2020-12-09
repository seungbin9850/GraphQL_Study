import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema, Query, Resolver } from "type-graphql";
import "reflect-metadata";
import { createConnection } from "typeorm";

@Resolver()
class HelloResolver {
  @Query(() => String, { nullable: true })
  async hello() {
    return "hello world";
  }
}

const main = async () => {
  await createConnection();
  const schema = await buildSchema({ resolvers: [HelloResolver] });
  const apolloServer = new ApolloServer({ schema });
  const app = Express();
  apolloServer.applyMiddleware({ app });
  app.listen(3000, () => {
    console.log("server start");
  });
};

main();
