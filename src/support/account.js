const store = new Map();
const logins = new Map();
const nanoid = require('nanoid');
const axios = require('axios');

const dbUrl = 'http://m5nv-oidc-db.com:5000/api/account/';

class Account {
  constructor(id, profile) {
    this.accountId = id || nanoid();
    this.profile = profile;
    store.set(this.accountId, this);
  }

  /**
   * @param use - can either be "id_token" or "userinfo", depending on
   *   where the specific claims are intended to be put in.
   * @param scope - the intended scope, while oidc-provider will mask
   *   claims depending on the scope automatically you might want to skip
   *   loading some claims from external resources etc. based on this detail
   *   or not return them in id tokens but only userinfo and so on.
   */
  async claims(use, scope) { // eslint-disable-line no-unused-vars
    if (this.profile) {
      return {
        sub: this.accountId, // it is essential to always return a sub claim
        firstName: this.profile.firstName,
        lastName: this.profile.lastName,
        email: this.profile.email,
        phoneNumber: this.profile.phoneNumber,
      };
    }

    return {
      sub: this.accountId, // it is essential to always return a sub claim
      firstName: 'Not-Registered',
      lastName: 'Not-Registered',
      email: 'Not-Registered@oidc-provider.com',
      phoneNumber: '0000000000',
    };
  }

  static async findByFederated(provider, claims) {
    const id = `${provider}.${claims.sub}`;
    if (!logins.get(id)) {
      logins.set(id, new Account(id, claims));
    }
    return logins.get(id);
  }

  static async findByLogin(login) {
    if (!logins.get(login)) {
      logins.set(login, new Account(login));
    }

    return logins.get(login);
  }

  static async findAccount(ctx, id, token) { // eslint-disable-line no-unused-vars
    // token is a reference to the token used for which a given account is being
    // loaded, it is undefined in scenarios where account claims are returned
    // from authorization endpoint
    // ctx is the koa request context

    const profile = {};
    if (!store.get(id).profile) {
      axios({
        headers: { Accept: 'application/json' },
        method: 'get',
        url: dbUrl + id,
      }).then((response) => {
        if (response.status === 200) {
          profile.firstName = response.data.account.firstName;
          profile.lastName = response.data.account.lastName;
          profile.email = response.data.account.email;
          profile.phoneNumber = response.data.account.phoneNumber;
        }
        store.get(id).profile = profile;
      }).catch(() => {});
    }
    return store.get(id);
  }
}

module.exports = Account;
