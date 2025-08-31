const { encryptKey } = require('./encryptKey');
const { decryptKey } = require('./decryptKey');
const api = require('./api');
const jwt = require('./jwt');
/**
 * Validates user via Superadmin API
 * @param {string} username
 * @param {string} password
 * @param {string} accessKey
 * @returns {Promise<{ token: string, accessKey: string }>}
 */
async function validateUser(username, password, accessKey, metadata) {
  // Encrypt accessKey using AES and keyName (username)
  const encryptedKey = encryptKey(accessKey, username);
  // Send to Superadmin API, include metadata
  const response = await api.authorize({ username, password, accessKey: encryptedKey, metadata });
  if (response && response.token && response.encryptedAccessKey && response.metadata) {
    // Decrypt accessKey from response
    const decryptedAccessKey = decryptKey(response.encryptedAccessKey, username);
    return { token: response.token, accessKey: decryptedAccessKey, metadata: response.metadata };
  }
  return null;
}
module.exports = { validateUser };