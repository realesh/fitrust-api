import {prisma} from '../generated/prisma-client';
import datamodelInfo from '../generated/nexus-prisma';
import * as path from 'path';
// import { stringArg, idArg } from 'nexus';
import {prismaObjectType, makePrismaSchema} from 'nexus-prisma';
import {GraphQLServer} from 'graphql-yoga';
// import { stringArg } from 'nexus/dist/core';
import {Context} from './types/server-type';
import * as allResolvers from './resolvers';

const User = prismaObjectType({
  name: 'User',
  definition(t) {
    t.prismaFields(['username', 'profile']);
  },
});

const Query = prismaObjectType({
  name: 'Query',
  definition(t) {
    t.prismaFields(['users', 'profiles']);
    t.list.field('getAllUsers', {
      type: 'User',
      resolve: (_, _args, ctx: Context) => {
        return ctx.prisma.users();
      },
    });
    // t.list.field('getUserByName', {
    //   type: 'User',
    //   args: {
    //     name: stringArg()
    //   },
    //   resolve: (_, { name }, ctx: Context) => {
    //     return ctx.prisma.userProfiles({
    //       where: { name_contains: name || '' }
    //     });
    //   }
    // });
  },
});

const Mutation = prismaObjectType({
  name: 'Mutation',
  definition(t) {
    t.prismaFields(['createUser', 'updateUser', 'updateProfile']);
    // t.prismaFields(['createUser', 'deletePost']);
    // t.field('createDraft', {
    //   type: 'Post',
    //   args: {
    //     title: stringArg(),
    //     authorId: idArg({ nullable: true })
    //   },
    //   resolve: (_, { title, authorId }, ctx) =>
    //     ctx.prisma.createPost({
    //       title,
    //       author: { connect: { id: authorId } }
    //     })
    // });
    // t.field('publish', {
    //   type: 'Post',
    //   nullable: true,
    //   args: { id: idArg() },
    //   resolve: (_, { id }, ctx) =>
    //     ctx.prisma.updatePost({
    //       where: { id },
    //       data: { published: true }
    //     })
    // });
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
server.start(() => console.log('Server is running on http://localhost:4000'));
