const crypto = require('crypto');

/**
 * Decrypts the access key using AES-256-CBC
 * @param {string} encryptedKey (iv:encrypted)
 * @param {string} keyName
 * @returns {string} Decrypted access key
 */
function decryptKey(encryptedKey, keyName) {
  const key = crypto.createHash('sha256').update(keyName).digest();
  const [ivStr, encStr] = encryptedKey.split(':');
  const iv = Buffer.from(ivStr, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encStr, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { decryptKey };
