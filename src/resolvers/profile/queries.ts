import {stringArg, queryField} from 'nexus/dist';
import {UserBadges} from './schema';
import {Badges} from '../../../generated/prisma-client';

type UserBadge = {
  id: string;
  name: string;
  desc: string;
  imageUrl: string;
  unlocked: boolean;
};

export let badgesList = queryField('badgesList', {
  type: UserBadges,
  args: {
    id: stringArg({required: true}),
  },
  resolve: async (_, {id}, context) => {
    let userBadges = await context.prisma
      .user({id: id || ''})
      .profile()
      .badges();
    let badges = await context.prisma.badgeses();

    let userBadgeses: Array<UserBadge> = badges.map((badge: Badges) => {
      return {
        ...badge,
        unlocked: false,
      };
    });

    userBadgeses.forEach((badge: UserBadge, index) => {
      if (userBadges.find((userBadge: Badges) => badge.id === userBadge.id)) {
        userBadgeses[index] = {
          ...userBadgeses[index],
          unlocked: true,
        };
      }
    });

    return {
      userBadges: userBadgeses,
      unlocked: userBadgeses.length,
    };
  },
});
