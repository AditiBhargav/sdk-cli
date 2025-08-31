const crypto = require('crypto');

/**
 * Encrypts the access key using AES-256-CBC
 * @param {string} accessKey
 * @param {string} keyName
 * @returns {string} Encrypted key (iv:encrypted)
 */
function encryptKey(accessKey, keyName) {
  const key = crypto.createHash('sha256').update(keyName).digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(accessKey, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return iv.toString('base64') + ':' + encrypted;
}

module.exports = { encryptKey };
