import { Context } from '../types/server-type';

export function users(_parent: any, _args: any, context: Context) {
  return context.prisma.users();
}

export function createUser(
  _parent: any,
  args: { name: string },
  context: Context
) {
  return context.prisma.createUser({ name: args.name });
}

// export const User = {
//   name(parent: any, _args: any, _context: Context) {
//     return parent.name;
//   }
// };
