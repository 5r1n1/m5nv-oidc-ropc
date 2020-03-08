const { interactionPolicy: { Prompt, base: policy } } = require('oidc-provider');

// copies the default policy, already has login and consent prompt policies
const interactions = policy();

// create a requestable prompt with no implicit checks
const selectAccount = new Prompt({
  name: 'select_account',
  requestable: true,
});

const jwks = require('./jwks.json');

// add to index 0, order goes select_account > login > consent
interactions.add(selectAccount, 0);

module.exports = {
  clients: [
    {
      client_id: 'CIA1B2C3D4E5',
      client_secret: 'im5rNDuiUYQDIB9iQZdA',
      grant_types: ['authorization_code'/* , 'refresh_token', 'implicit' */],
      response_types: ['code'/* , 'id_token', 'code id_token' */],
      redirect_uris: ['https://m5nv-relying-party.com:3000/oauth2test/callback'],
    },
    {
      client_id: 'CIA5B4C3D2E1',
      client_secret: 'im5rNDuiUYQDIB9iQZdA',
      grant_types: ['authorization_code'/* , 'refresh_token', 'implicit' */],
      response_types: ['code'/* , 'id_token', 'code id_token' */],
      redirect_uris: ['https://m5nv-relying-party.com/oauth2test/callback'],
    },
  ],
  interactions: {
    policy: interactions,
    url(ctx, interaction) { // eslint-disable-line no-unused-vars
      return `/interaction/${ctx.oidc.uid}`;
    },
  },
  cookies: {
    long: { signed: true, maxAge: (1 * 24 * 60 * 60) * 1000 }, // 1 day in ms
    short: { signed: true },
    keys: ['some secret key', 'and also the old rotated away some time ago', 'and one more'],
  },
  claims: {
    email: ['email'],
    phone: ['phoneNumber'],
    profile: ['firstName', 'lastName'],
  },
  features: {
    devInteractions: { enabled: false }, // defaults to true
    deviceFlow: { enabled: true }, // defaults to false
    introspection: { enabled: true }, // defaults to false
    revocation: { enabled: true }, // defaults to false
  },
  jwks, // Generated using generate-keys
  ttl: {
    AccessToken: 1 * 60 * 60, // 1 hour in seconds
    AuthorizationCode: 10 * 60, // 10 minutes in seconds
    IdToken: 1 * 60 * 60, // 1 hour in seconds
    DeviceCode: 10 * 60, // 10 minutes in seconds
    RefreshToken: 1 * 24 * 60 * 60, // 1 day in seconds
  },
};
