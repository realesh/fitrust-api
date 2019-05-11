import {mutationField, stringArg} from 'nexus/dist';
import {RegisterUser, LoginUser, ChangePassword} from './schema';
import {hash, compare} from 'bcrypt';
import {sign} from 'jsonwebtoken';
import {APP_SECRET} from '../../SECRET';

export let register = mutationField('registerUser', {
  type: RegisterUser,
  args: {
    username: stringArg({required: true}),
    password: stringArg({required: true}),
    name: stringArg({required: true}),
    dob: stringArg({required: true}),
  },
  resolve: async (_, {dob, name, password, username}, context) => {
    let hashPassword = await hash(password, 10);
    let result = await context.prisma.createUser({
      username,
      password: hashPassword,
      profile: {
        create: {
          name,
          dob,
        },
      },
    });
    return {
      id: result.id,
      token: sign(
        {
          userID: result.id,
        },
        APP_SECRET,
        {expiresIn: '7d'},
      ),
      name,
    };
  },
});

export let login = mutationField('loginUser', {
  type: LoginUser,
  args: {
    username: stringArg({required: true}),
    password: stringArg({required: true}),
  },
  resolve: async (_, {username, password}, context) => {
    let result = await context.prisma.user({username});
    let profile = await context.prisma.user({username}).profile();

    if (!result) {
      throw new Error('Username not found!');
    }
    let isPasswordValid = await compare(password, result.password);
    if (isPasswordValid) {
      return {
        id: result.id,
        token: sign(
          {
            userID: result.id,
          },
          APP_SECRET,
          {expiresIn: '7d'},
        ),
        name: profile.name,
      };
    }
    throw new Error("Username and password doesn't match");
  },
});

export let changePassword = mutationField('changePassword', {
  type: ChangePassword,
  args: {
    id: stringArg({required: true}),
    oldPassword: stringArg({required: true}),
    newPassword: stringArg({required: true}),
  },
  resolve: async (_, {id, oldPassword, newPassword}, context) => {
    let result = await context.prisma.user({id});
    let isPasswordValid = await compare(oldPassword, result.password);
    let hashPassword = await hash(newPassword, 10);

    if (!result) {
      throw new Error('UserID not found!');
    }

    if (isPasswordValid) {
      await context.prisma.updateUser({
        data: {
          password: hashPassword,
        },
        where: {
          id,
        },
      });
      return {
        id: result.id,
      };
    }

    throw new Error('Invalid password!');
  },
});
