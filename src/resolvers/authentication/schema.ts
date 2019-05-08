import {objectType} from 'nexus/dist';

export let RegisterUser = objectType({
  name: 'RegisterUser',
  definition(t) {
    t.string('token'), t.string('name');
  },
});

export let LoginUser = objectType({
  name: 'LoginUser',
  definition(t) {
    t.string('token'), t.string('name');
  },
});
