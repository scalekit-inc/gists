import axios from 'axios';

/**
 * Client Credentials OAuth 2.0 Flow
 * This flow is used for server-to-server authentication where a client application
 * authenticates itself (rather than a user) to access protected resources.
 */

// Configuration
const config = {
  clientId: process.env.SCALEKIT_M2M_CLIENT_ID,
  clientSecret: process.env.SCALEKIT_M2M_CLIENT_SECRET,
  tokenUrl: `${process.env.SCALEKIT_ENVIRONMENT_URL}/oauth/token`,
};

main();

/**
 * Get an access token using the client credentials flow
 * @returns {Promise<string>} The access token
 */
async function getClientCredentialsToken(): Promise<string> {
  try {
    // Prepare the request body
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    // params.append('grant_type', 'refresh_token');
    params.append('client_id', config.clientId);
    params.append('client_secret', config.clientSecret);

    if (config.scope) {
      params.append('scope', config.scope);
    }

    // Make the token request
    const response = await axios.post(config.tokenUrl, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Extract and return the access token
    const { access_token, expires_in } = response.data;

    console.log('************************************************');
    console.log('Full response:', response.data);
    console.log(
      'Token acquired successfully. Expires in',
      expires_in,
      'seconds.'
    );
    console.log('************************************************');

    return access_token;
  } catch (error) {
    console.error('Error getting client credentials token:', error);
    throw new Error('Failed to obtain access token');
  }
}

/**
 * Example usage: Make an authenticated API request
 * @param {string} url - The API endpoint to call
 * @returns {Promise<any>} The API response
 */
async function makeAuthenticatedRequest(url: string): Promise<any> {
  try {
    // Get the access token
    const token = await getClientCredentialsToken();

    // Make the authenticated request
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error making authenticated request:', error);
    throw error;
  }
}

// Example usage
async function main() {
  try {
    // Get the token first to log it
    const token = await getClientCredentialsToken();
    console.log('Bearer Token:', token);

    // Make request to local server
    const data = await makeAuthenticatedRequest(
      'http://localhost:4000/api/test'
    );
    console.log('Local Server Response:', data);
  } catch (error) {
    console.error('Main function error:', error);
  }
}
