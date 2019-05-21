import {prisma} from '../generated/prisma-client';
import datamodelInfo from '../generated/nexus-prisma';
import * as path from 'path';
import {prismaObjectType, makePrismaSchema} from 'nexus-prisma';
import {GraphQLServer} from 'graphql-yoga';
import {Context} from './types/server-type';
import * as allResolvers from './resolvers';

const User = prismaObjectType({
  name: 'User',
  definition(t) {
    t.prismaFields(['id', 'username', 'profile']);
  },
});

const Query = prismaObjectType({
  name: 'Query',
  definition(t) {
    t.prismaFields([
      'user',
      'users',
      'profiles',
      'badges',
      'exerciseCoupon',
      'badgeses',
      'badgesesConnection',
      'exerciseCoupons',
      'exerciseCouponsConnection',
    ]);
    t.list.field('getAllUsers', {
      type: 'User',
      resolve: (_, _args, ctx: Context) => {
        return ctx.prisma.users();
      },
    });
  },
});

const Mutation = prismaObjectType({
  name: 'Mutation',
  definition(t) {
    t.prismaFields([
      'createUser',
      'updateUser',
      'updateProfile',
      'createBadges',
      'createExerciseCoupon',
      'deleteExerciseCoupon',
    ]);
  },
});

const schema = makePrismaSchema({
  types: [Query, Mutation, User, allResolvers],

  prisma: {
    datamodelInfo,
    client: prisma,
  },

  outputs: {
    schema: path.join(__dirname, '../generated/schema.graphql'),
    typegen: path.join(__dirname, '../generated/nexus.ts'),
  },

  typegenAutoConfig: {
    sources: [
      {
        source: path.join(__dirname, './types.ts'),
        alias: 'types',
      },
    ],
    contextType: 'types.Context',
  },
});

const server = new GraphQLServer({
  schema,
  context: {prisma},
});
server.start(() => console.log('Server is RUNNING on http://localhost:4000'));
