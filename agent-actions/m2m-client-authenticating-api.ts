/**
 * Machine-to-Machine (M2M) Client Authentication Example
 *
 * This example demonstrates how to implement OAuth 2.0 Client Credentials flow
 * for server-to-server authentication. This is commonly used when a client application
 * needs to authenticate itself (rather than a user) to access protected resources.
 *
 * Key Features:
 * - Client Credentials OAuth 2.0 flow
 * - Environment variable based configuration
 * - Token management and automatic refresh
 * - Authenticated API requests
 */

import axios from 'axios';

// Configuration interface for better type safety
interface AuthConfig {
  clientId: string;
  clientSecret: string;
  tokenUrl: string;
  scope?: string;
}

// Load configuration from environment variables
const config: AuthConfig = {
  clientId: process.env.SCALEKIT_M2M_CLIENT_ID || '',
  clientSecret: process.env.SCALEKIT_M2M_CLIENT_SECRET || '',
  tokenUrl: `${process.env.SCALEKIT_ENVIRONMENT_URL}/oauth/token`,
  scope: process.env.SCALEKIT_M2M_SCOPE || undefined,
};

// Token response interface
interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}

/**
 * Retrieves an access token using the client credentials flow
 * This function:
 * 1. Prepares the token request with client credentials
 * 2. Makes a POST request to the token endpoint
 * 3. Returns the access token for use in API requests
 *
 * @returns {Promise<string>} The access token
 * @throws {Error} If token request fails
 */
async function getClientCredentialsToken(): Promise<string> {
  try {
    // Prepare the request body with required OAuth parameters
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', config.clientId);
    params.append('client_secret', config.clientSecret);

    // Add scope if configured
    if (config.scope) {
      params.append('scope', config.scope);
    }

    // Make the token request to the authorization server
    const response = await axios.post<TokenResponse>(config.tokenUrl, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, expires_in } = response.data;

    // Log token acquisition details
    console.log('************************************************');
    console.log('Token Response:', response.data);
    console.log(
      `Token acquired successfully. Expires in ${expires_in} seconds.`
    );
    console.log('************************************************');

    return access_token;
  } catch (error) {
    console.error('Error getting client credentials token:', error);
    throw new Error('Failed to obtain access token');
  }
}

/**
 * Makes an authenticated API request using the obtained access token
 * This function:
 * 1. Gets a fresh access token
 * 2. Makes the API request with the token in the Authorization header
 * 3. Returns the API response data
 *
 * @param {string} url - The API endpoint to call
 * @returns {Promise<any>} The API response data
 * @throws {Error} If the request fails
 */
async function makeAuthenticatedRequest(url: string): Promise<any> {
  try {
    // Get a fresh access token
    const token = await getClientCredentialsToken();

    // Make the authenticated request with the token
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

/**
 * Main function demonstrating the usage of the authentication flow
 * This function:
 * 1. Gets an access token and logs it
 * 2. Makes a test request to a local server
 * 3. Handles any errors that occur
 */
async function main() {
  try {
    // Get and log the token
    const token = await getClientCredentialsToken();
    console.log('Bearer Token:', token);

    // Make a test request to local server
    const data = await makeAuthenticatedRequest(
      'http://localhost:4000/api/test'
    );
    console.log('Local Server Response:', data);
  } catch (error) {
    console.error('Main function error:', error);
  }
}

// Execute the main function
main();
