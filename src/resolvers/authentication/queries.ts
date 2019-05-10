import {stringArg, queryField} from 'nexus/dist';
import {VerifyToken} from './schema';
import {verify} from 'jsonwebtoken';
import {APP_SECRET} from '../../SECRET';
import {isString} from 'util';

type IDObject = {
  userID: string | null;
};

export let verifyToken = queryField('verifyToken', {
  type: VerifyToken,
  args: {
    token: stringArg({required: true}),
  },
  resolve: async (_, {token}, context) => {
    let ID: IDObject = {
      userID: null,
    };
    let verifiedReturn = <IDObject>verify(token, APP_SECRET);
    if (isString(verifiedReturn)) {
      throw new Error();
    }
    if (verifiedReturn.hasOwnProperty('userID'))
      ID = {
        userID: verifiedReturn.userID,
      };
    console.log(ID.userID, '<<<<<<<');
    let result = await context.prisma.user({id: ID.userID || ''});
    let profile = await context.prisma.user({id: ID.userID || ''}).profile();
    return {
      id: result.id,
      name: profile.name,
    };
  },
});
