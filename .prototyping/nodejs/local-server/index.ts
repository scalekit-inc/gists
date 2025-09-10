import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import axios from 'axios';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const app = express();
const port = 4000;

// Enable CORS
app.use(cors());
app.use(express.json());

// JWKS client setup
const jwksUri = 'https://scalekit-z44iroqaaada-dev.scalekit.cloud/keys';
const client = jwksClient({
  jwksUri,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  timeout: 10000,
});

// Function to get signing key using Promises
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

// Middleware to validate JWT
async function validateToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.log('Validating token...');

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
    // First decode the token to get the header
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded) {
      console.log('Invalid token format');
      throw new Error('Invalid token format');
    }

    console.log('Token header:', decoded.header);

    // Get the signing key
    const signingKey = await getKey(decoded.header);
    console.log('Successfully retrieved signing key');

    // Verify the token
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

// Test endpoint that shows the decoded token without validation
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

// Test endpoint with token validation
app.get('/api/test', validateToken, (req, res) => {
  console.log('Request validated successfully');
  res.json({
    message: 'Token validated successfully',
    user: req.user,
    headers: req.headers,
  });
});

// Error handling middleware
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

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Test endpoints:');
  console.log('1. Decode token (no validation):');
  console.log(
    '   curl -H "Authorization: Bearer YOUR-TOKEN" http://localhost:3000/api/decode'
  );
  console.log('2. Validate token:');
  console.log(
    '   curl -H "Authorization: Bearer YOUR-TOKEN" http://localhost:3000/api/test'
  );
});
