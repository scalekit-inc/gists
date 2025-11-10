import { Scalekit } from '@scalekit-sdk/node';

// Initialize Scalekit client
const scalekit = new Scalekit(
  process.env.SCALEKIT_ENVIRONMENT_URL!,
  process.env.SCALEKIT_CLIENT_ID!,
  process.env.SCALEKIT_CLIENT_SECRET!
);

/**
 * Validate an ID token received from Scalekit
 *
 * @param token - The ID token to validate
 * @returns Decoded token payload if valid
 */
async function validateIdToken(token: string) {
  try {
    // Basic validation - validates signature, expiration, and issuer
    const decodedToken = await scalekit.validateToken(token);

    console.log('Token is valid!');
    console.log('User ID:', decodedToken.sub);
    console.log('Email:', decodedToken.email);
    console.log('Organization ID:', decodedToken.org);

    return decodedToken;
  } catch (error) {
    console.error('Token validation failed:', error);
    throw error;
  }
}

/**
 * Advanced token validation with optional parameters
 *
 * @param token - The ID token to validate
 * @param options - Optional validation options
 */
async function validateIdTokenWithOptions(
  token: string,
  options?: {
    issuer?: string;              // Validate the token issuer
    audience?: string[];          // Validate the token audience claim (array of strings)
    requiredScopes?: string[];    // Validate token has required scopes
  }
) {
  try {
    // Pass the validation options to validateToken
    const decodedToken = await scalekit.validateToken(token, options);

    return decodedToken;
  } catch (error) {
    console.error('Token validation failed:', error);
    throw error;
  }
}

// Example usage
async function example() {
  // Token you received from the authentication callback
  const idToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...';

  // Basic validation
  const payload = await validateIdToken(idToken);
  console.log('Authenticated user:', payload.email);

  // Advanced validation with custom options
  const payloadWithOptions = await validateIdTokenWithOptions(idToken, {
    issuer: 'https://auth.scalekit.com',
    audience: ['your-client-id'],
    requiredScopes: ['openid', 'profile'],
  });
  console.log('Validated with options:', payloadWithOptions.email);
}

// Run the example
example().catch(console.error);
