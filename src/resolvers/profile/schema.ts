import {objectType} from 'nexus/dist';

export let UserBadges = objectType({
  name: 'UserBadges',
  definition(t) {
    t.int('unlocked');
    t.list.field('userBadges', {
      type: Badges, // here
    });
    t.list.field('lockedBadges', {
      type: Badges, // here
    });
  },
});

const Badges = objectType({
  // here
  name: 'Badges', // and here
  definition(t) {
    t.id('id');
    t.string('name');
    t.string('desc');
    t.string('imageUrl');
    t.boolean('unlocked');
  },
});

export let ConnectBadges = objectType({
  name: 'ConnectBadges',
  definition(t) {
    t.int('statusCode'), t.string('name'), t.string('imageUrl');
  },
});

export let IncCouponsRedeemed = objectType({
  name: 'IncCouponsRedeemed',
  definition(t) {
    t.int('total');
  },
});

export let ClaimStepsGoal = objectType({
  name: 'ClaimStepsGoal',
  definition(t) {
    t.int('total');
  },
});

export let ClaimWaterGoal = objectType({
  name: 'ClaimWaterGoal',
  definition(t) {
    t.int('total');
  },
});
