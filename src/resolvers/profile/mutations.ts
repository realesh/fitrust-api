import {mutationField, stringArg} from 'nexus/dist';
import {ConnectBadges} from './schema';
import {Badges} from '../../../generated/prisma-client';

export let connectBadges = mutationField('connectBadges', {
  type: ConnectBadges,
  args: {
    id: stringArg({required: true}),
    badgeID: stringArg({required: true}),
  },
  resolve: async (_, {id, badgeID}, context) => {
    let userBadgesList = await context.prisma
      .user({id})
      .profile()
      .badges();
    let userBadgesIDList = userBadgesList.map((badge: Badges) => badge.id);
    let findIndex = userBadgesIDList.findIndex((itemID: string) => itemID === badgeID);
    if (findIndex === -1) {
      let badgeUnlocked = await context.prisma.badges({id: badgeID});
      let userPoints = await context.prisma
        .user({id})
        .profile()
        .points();
      await context.prisma.updateUser({
        data: {
          profile: {
            update: {
              points: userPoints + badgeUnlocked.points,
              badges: {
                connect: {
                  id: badgeID,
                },
              },
            },
          },
        },
        where: {
          id,
        },
      });
      return {
        statusCode: 200,
        name: badgeUnlocked.name,
        imageUrl: badgeUnlocked.imageUrl,
      };
    } else {
      return {
        statusCode: 409,
        name: '',
        imageUrl: '',
      };
    }
  },
});
