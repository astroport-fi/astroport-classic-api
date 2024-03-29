import { ApolloServer } from "apollo-server-lambda";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { DateTimeResolver } from "graphql-scalars";
import mongoose from "mongoose";

import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import constants from "../environment/constants";

let db: any = null;

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    DateTime: DateTimeResolver,
    ...resolvers,
  },
});

const apolloServer = new ApolloServer({
  schema,
  context: async () => {
    if (db == null) {
      if (constants.MONGODB_URL == null) {
        return;
      }

      try {
        console.log("connecting to mongo");

        const options: mongoose.ConnectOptions = {};
        db = await mongoose.connect(constants.MONGODB_URL, options);
      } catch (e) {
        console.log("--->error while connecting via graphql context (db)", e);
      }
    }

    return { db };
  },
  debug: constants.ENABLE_DEBUG,
  introspection: constants.ENABLE_GRAPHQL_INTROSPECTION,
});

export const run = apolloServer.createHandler();
