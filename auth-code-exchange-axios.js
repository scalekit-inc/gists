// express.js

import axios from 'axios';

const redirectUri = 'http://localhost:3000/api/callback';

app.get('/api/callback', async (req, res) => {
  const { error, error_description, code } = req.query;

  if (error) {
    console.error('SSO callback error:', error, error_description);
    return;
  }

  const { id_token } = await exchangeCodeForToken({
    env_url: process.env.SCALEKIT_ENV_URL,
    code,
    redirect_uri: redirectUri,
    client_id: process.env.SCALEKIT_CLIENT_ID,
    client_secret: process.env.SCALEKIT_CLIENT_SECRET,
  });

  console.log('user claims', id_token);

  // Continue with your application logged in experience
  res.redirect('/profile');
});

async function exchangeCodeForToken({
  env_url,
  code,
  redirect_uri,
  client_id,
  client_secret,
}) {
  try {
    const response = await axios.post(
      `${env_url}/oauth/token`,
      null, // No request body needed
      {
        params: {
          code,
          redirect_uri,
          client_id,
          client_secret,
          grant_type: 'authorization_code',
          scopes: ['openid', 'profile', 'email', 'offline_access'],
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw error;
  }
}
