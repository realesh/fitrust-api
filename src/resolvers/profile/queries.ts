import {stringArg, queryField} from 'nexus/dist';
import {UserBadges} from './schema';

type UserBadge = {
  id: string;
  name: string;
  desc: string;
  imageUrl: string;
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

    let userBadgesIDs = userBadges.map((userBadge: UserBadge) => userBadge.id);

    let lockedBadges = badges.filter((badge: UserBadge) => userBadgesIDs.indexOf(badge.id) < 0);

    return {
      userBadges,
      lockedBadges,
      unlocked: userBadges.length,
    };
  },
});
