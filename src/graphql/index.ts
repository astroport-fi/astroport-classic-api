import { ApolloServer } from "apollo-server-lambda";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { DateTimeResolver } from "graphql-scalars";
import mongoose from "mongoose";

import { MONGODB_URL } from "../constants";
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
    console.log("process.env.NODE_ENV");
    console.log(process.env.NODE_ENV);

    console.log("SIMPLE_STRING_VALUE");
    console.log(constants.SIMPLE_STRING_VALUE);
    console.log("SECOND_SIMPLE_STRING_VALUE");
    console.log(constants.SECOND_SIMPLE_STRING_VALUE);
    console.log("DECIMALS (from .env file)");
    console.log(constants.DECIMALS);
    console.log("MONGODB_URL (from .env file)");
    console.log(constants.MONGODB_URL);
    console.log("MAP_VALUE");
    console.log(constants.MAP_VALUE);
    console.log("MORE_COMPLEX_TYPE");
    console.log(constants.MORE_COMPLEX_TYPE);
    console.log("SIMPLE_OBJECT");
    console.log(constants.SIMPLE_OBJECT);

    if (db == null) {
      if (MONGODB_URL == null) {
        return;
      }

      try {
        console.log("connecting to mongo");

        const options: mongoose.ConnectOptions = {};
        db = await mongoose.connect(MONGODB_URL, options);
      } catch (e) {
        console.log("--->error while connecting via graphql context (db)", e);
      }
    }

    return { db };
  },
  debug: false,
});

export const run = apolloServer.createHandler();
