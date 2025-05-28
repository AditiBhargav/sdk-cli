const crypto = require('crypto');

function aesDecrypt(encryptedText, secretKey, salt, ivHex) {
  const key = crypto.scryptSync(secretKey, salt, 32);
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = aesDecrypt;
