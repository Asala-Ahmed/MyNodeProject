import fs from 'fs';
import crypto from 'crypto';

const generateHash = (length) => {
    return crypto.randomBytes(length).toString('hex');
};

// Generate random hashed secrets
const accessTokenSecret = generateHash(32); // 32 bytes for access token
const refreshTokenSecret = generateHash(32); // 32 bytes for refresh token

// Append secrets to .env file
const envContent = `
ACCESS_TOKEN_SECRET=${accessTokenSecret}
REFRESH_TOKEN_SECRET=${refreshTokenSecret}
`;

fs.appendFileSync('.env', envContent.trim());

console.log('Secrets generated and saved to .env');
