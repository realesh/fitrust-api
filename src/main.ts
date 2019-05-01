import { prisma } from '../generated/prisma-client';
import { GraphQLServer } from 'graphql-yoga';
import { users, createUser } from './queries/userQuery';

const resolvers = {
  Query: {
    users
  },
  Mutation: {
    createUser
  }
  // User
};
const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma
  }
});
server.start({ port: 3000 }, () =>
  console.log('Server is running on http://localhost:3000')
);
