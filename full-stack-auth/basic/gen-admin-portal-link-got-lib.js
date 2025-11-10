import got from 'got';

/**
 * Makes call to /oauth/token endpoint to get access token
 */

import getToken from './auth.js';

await getPortalLink(orgID);

export async function getPortalLink() {
  const orgID = 'org_40103405632356531';
  const accessToken = await getToken();
  const url = `${process.env.SCALEKIT_ENVIRONMENT_URL}/api/v1/organizations/${orgID}/portal_links`;

  try {
    const response = await got.put(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return JSON.parse(response.body);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
