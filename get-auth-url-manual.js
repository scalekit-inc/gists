const redirectUri = 'http://localhost:3000/api/callback';

const authorizationUrl = initiateAuth({
  env_url: process.env.SCALEKIT_ENV_URL,
  redirect_uri: redirectUri,
  scopes: ['openid', 'profile', 'email'],
});

async function initiateAuth({ env_url, redirect_uri, scopes }) {
  return `${env_url}/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scopes.join(
    ' '
  )}`;
}

console.log(authorizationUrl);
