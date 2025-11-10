import { Scalekit } from '@scalekit-sdk/node';

const redirectUri = 'http://localhost:3000/api/callback';

const scalekit = new Scalekit(
  process.env.SCALEKIT_ENV_URL,
  process.env.SCALEKIT_CLIENT_ID,
  process.env.SCALEKIT_CLIENT_SECRET
);

/**
 * Generates an OAuth 2.0 authorization URL for initiating the SSO flow
 * @param {string} redirectUri - The URI to redirect to after authorization
 * @param {Object} [options] - Optional configuration parameters
 * @param {string[]} [options.scopes] - Array of OAuth scopes to request
 * @param {string} [options.connectionId] - Specific connection ID for domain-based SSO
 * @param {string} [options.loginHint] - Email/username hint for pre-filled login
 * @param {string} [options.state] - CSRF protection value
 * @param {string} [options.nonce] - Cryptographic nonce for ID token validation
 * @returns {string} Authorization URL to redirect the user to
 *
 * Typical usage:
 * - Constructs URL with required OAuth parameters
 * - Handles URL encoding of parameters
 * - Sets response_type=code for authorization code flow
 * - Includes client_id from Scalekit configuration
 * - Merges provided scopes or uses default ['openid', 'profile', 'email']
 * - Appends any additional options as query parameters
 */

let options = Object.create({});

options['loginHint'] = email;
options['connectionId'] = 'conn_59615204090052747';
options['scopes'] = ['openid', 'profile', 'email'];

const authorizationUrl = scalekit.getAuthorizationUrl(redirectUri, options);

console.log('authorizationUrl', authorizationUrl);

/**
 * @example redirect users to this endpoint to initiate auth flow
 * https://<scalekit-environment-domain>.scalekit.cloud/oauth/authorize?response_type=code&client_id=skc_58327482062864390&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fcallback&scope=openid%20profile%20email
 *
 * @docs
 * https://docs.scalekit.com/manual/getting-started/authenticate-users
 */
