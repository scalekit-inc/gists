// express.js

import { Scalekit } from '@scalekit-sdk/node';

const redirectUri = 'http://localhost:3000/api/callback';

const scalekit = new Scalekit(
  process.env.SCALEKIT_ENV_URL,
  process.env.SCALEKIT_CLIENT_ID,
  process.env.SCALEKIT_CLIENT_SECRET
);

app.get('/api/callback', async (req, res) => {
  const { error, error_description, code } = req.query;

  if (error) {
    console.error('SSO callback error:', error, error_description);
    return;
  }

  try {
    const { user, idToken } = await scalekit.authenticateWithCode(
      code,
      redirectUri
    );

    // Continue with your application logged in experience
    res.redirect('/profile');
  } catch (error) {
    console.error('Token exchange error:', error);
  }
});
