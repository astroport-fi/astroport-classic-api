import { ApolloServer } from 'apollo-server-lambda';
import mongoose from 'mongoose';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { DateTimeResolver } from 'graphql-scalars';

import { MONGODB_URL } from '../constants';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';

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
      if (MONGODB_URL == null) {
        return;
      }

      try {
        console.log('connecting to mongo');

        let options: mongoose.ConnectOptions = {}
        options.sslCA = `${__dirname}/rds-combined-ca-bundle.pem`;

        db = await mongoose.connect(MONGODB_URL, options);
      } catch (e) {
        console.log('--->error while connecting via graphql context (db)', e);
      }
    }

    return { db };
  },
});

export const graphqlHandler = apolloServer.createHandler();
