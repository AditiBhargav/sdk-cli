const cache = require('./cache');
const validation = require('./validation');
const jwt = require('./jwt');

/**
 * Main login function for SDK
 * @param {string} username
 * @param {string} password
 * @param {string} accessKey
 * @returns {Promise<{ token: string, accessKey: string }>} JWT and accessKey
 */
async function login(username, password, accessKey) {
  // Check cache for valid JWT and accessKey
  const cached = cache.get(username);
  if (cached && jwt.isValid(cached.token)) {
    return { token: cached.token, accessKey: cached.accessKey };
  }
  // If no accessKey provided, generate a random one
  if (!accessKey) {
    const { generateRandomString } = require('../utils/generateRandoms');
    accessKey = generateRandomString(32); // 32 chars random access key
  }
  // Read metadata from input.json
  const fs = require('fs');
  const path = require('path');
  let metadata = {};
  try {
    const metaPath = path.join(__dirname, '../data/input.json');
    metadata = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch (e) {
    metadata = {};
  }
  // Validate via Superadmin API (first-time or expired)
  const result = await validation.validateUser(username, password, accessKey, metadata);
  if (result && result.token && result.accessKey && result.metadata) {
    cache.set(username, result.token, result.accessKey);
    return { token: result.token, accessKey: result.accessKey, metadata: result.metadata };
  }
  throw new Error('Authorization failed');
}

module.exports = { login };
