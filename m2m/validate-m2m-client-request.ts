/**
 * M2M Client Request Validation Server
 *
 * This server demonstrates how to validate JWT tokens from M2M clients
 * using JWKS (JSON Web Key Set) for token verification.
 *
 * Key Features:
 * - JWT token validation using JWKS
 * - CORS support
 * - Error handling middleware
 * - Test endpoints for token validation
 */

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import axios from 'axios';

// Extend Express Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: any; // User information from the validated token
    }
  }
}

// Initialize Express application
const app = express();
const port = 4000;

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// JWKS client configuration
const jwksUri = `${process.env.SCALEKIT_ENVIRONMENT_URL}/keys`;
const client = jwksClient({
  jwksUri,
  cache: true, // Enable caching of JWKS
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  timeout: 10000, // 10 seconds timeout
});

/**
 * Retrieves the signing key from JWKS using the token's kid (Key ID)
 * This function:
 * 1. Gets the signing key from the JWKS client
 * 2. Extracts the public key
 * 3. Returns the key for token verification
 *
 * @param {any} header - The JWT header containing the kid
 * @returns {Promise<string>} The public key for verification
 * @throws {Error} If key retrieval or extraction fails
 */
async function getKey(header: any): Promise<string> {
  return new Promise((resolve, reject) => {
    client.getSigningKey(header.kid, (err: any, key: any) => {
      if (err) {
        console.error('Error getting signing key:', err);
        reject(err);
        return;
      }
      try {
        const signingKey = key.getPublicKey();
        resolve(signingKey);
      } catch (error) {
        console.error('Error extracting public key:', error);
        reject(error);
      }
    });
  });
}

/**
 * Middleware to validate JWT tokens
 * This middleware:
 * 1. Extracts the token from the Authorization header
 * 2. Decodes the token to get the header
 * 3. Retrieves the signing key from JWKS
 * 4. Verifies the token's signature
 * 5. Attaches the decoded payload to the request
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 */
async function validateToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.log('Validating token...');

  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('No authorization header found');
    return res.status(401).json({ error: 'No authorization header' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('No token found in authorization header');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Decode token to get header information
    const decoded = jwt.decode(token, { complete: true });

    console.log('Decoded token:', decoded);
    if (!decoded) {
      console.log('Invalid token format');
      throw new Error('Invalid token format');
    }

    console.log('Token header:', decoded.header);

    // Get the signing key for verification
    const signingKey = await getKey(decoded.header);
    console.log('Successfully retrieved signing key');

    // Verify the token's signature and claims
    const verified = jwt.verify(token, signingKey, {
      algorithms: ['RS256'],
      complete: true,
    });

    console.log('Token verified successfully');
    req.user = verified.payload;
    next();
  } catch (error: unknown) {
    console.error('Token validation error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return res.status(401).json({
      error: 'Token validation failed',
      details: errorMessage,
    });
  }
}

/**
 * Test endpoint that decodes the token without validation
 * Useful for debugging and understanding token structure
 */
app.get('/api/decode', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.decode(token, { complete: true });
    res.json({
      message: 'Token decoded (not validated)',
      decoded: decoded,
      headers: req.headers,
    });
  } catch (error) {
    res.status(400).json({
      error: 'Failed to decode token',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Test endpoint with full token validation
 * Demonstrates the complete validation flow
 */
app.get('/api/test', validateToken, (req, res) => {
  console.log('Request validated successfully');
  res.json({
    message: 'Token validated successfully',
    user: req.user,
    headers: req.headers,
  });
});

/**
 * Global error handling middleware
 * Catches and formats any unhandled errors
 */
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('Server error:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: err.message,
    });
  }
);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Test endpoints:');
  console.log('1. Decode token (no validation):');
  console.log(
    '   curl -H "Authorization: Bearer YOUR-TOKEN" http://yourapp.com/api/decode'
  );
  console.log('2. Validate token:');
  console.log(
    '   curl -H "Authorization: Bearer YOUR-TOKEN" http://yourapp.com/api/test'
  );
});
