import {objectType} from 'nexus/dist';

export let RegisterUser = objectType({
  name: 'RegisterUser',
  definition(t) {
    t.string('id'), t.string('token'), t.string('name');
  },
});

export let LoginUser = objectType({
  name: 'LoginUser',
  definition(t) {
    t.string('id'), t.string('token'), t.string('name');
  },
});

export let ChangePassword = objectType({
  name: 'ChangePassword',
  definition(t){
    t.string('id')
  }
})

export let VerifyToken = objectType({
  name: 'VerifyToken',
  definition(t) {
    t.string('id'), t.string('name');
  },
});
