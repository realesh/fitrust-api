import {mutationField, stringArg, idArg} from 'nexus/dist';
import {ConnectBadges, IncCouponsRedeemed, ClaimStepsGoal, ClaimWaterGoal} from './schema';
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
    let userBadgesIDList = userBadgesList.map((badge: Badges) => badge.id) || [];
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
        badgePoints: badgeUnlocked.points,
      };
    } else {
      return {
        statusCode: 409,
        name: '',
        imageUrl: '',
        badgePoints: 0,
      };
    }
  },
});

export let incCouponsRedeemed = mutationField('incCouponsRedeemed', {
  type: IncCouponsRedeemed,
  args: {
    id: idArg({required: false}),
  },
  resolve: async (_, {id}, context) => {
    let currTotal = await context.prisma
      .user({id})
      .profile()
      .couponsRedeemed();
    await context.prisma.updateUser({
      data: {
        profile: {
          update: {
            couponsRedeemed: currTotal + 1,
          },
        },
      },
      where: {
        id,
      },
    });

    return {
      total: currTotal + 1,
    };
  },
});

export let claimStepsGoal = mutationField('claimStepsGoal', {
  type: ClaimStepsGoal,
  args: {
    id: stringArg({required: true}),
  },
  resolve: async (_, {id}, context) => {
    let currTotal = await context.prisma
      .user({id})
      .profile()
      .stepsClaimed();
    let currPoints = await context.prisma
      .user({id})
      .profile()
      .points();
    await context.prisma.updateUser({
      data: {
        profile: {
          update: {
            todayStepClaimed: 1,
            points: currPoints + 100,
            stepsClaimed: currTotal + 1,
          },
        },
      },
      where: {
        id,
      },
    });

    return {
      total: currTotal + 1,
    };
  },
});

export let claimWaterGoal = mutationField('claimWaterGoal', {
  type: ClaimWaterGoal,
  args: {
    id: stringArg({required: true}),
  },
  resolve: async (_, {id}, context) => {
    let currTotal = await context.prisma
      .user({id})
      .profile()
      .waterClaimed();
    let currPoints = await context.prisma
      .user({id})
      .profile()
      .points();
    await context.prisma.updateUser({
      data: {
        profile: {
          update: {
            todaywaterClaimed: 1,
            points: currPoints + 50,
            waterClaimed: currTotal + 1,
          },
        },
      },
      where: {
        id,
      },
    });

    return {
      total: currTotal + 1,
    };
  },
});
