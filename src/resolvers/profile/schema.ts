import {objectType} from 'nexus/dist';

export let UserBadges = objectType({
  name: 'UserBadges',
  definition(t) {
    t.int('unlocked');
    t.list.field('userBadges', {
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
