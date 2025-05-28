const crypto = require('crypto');

function aesEncrypt(text, secretKey, salt) {
  const key = crypto.scryptSync(secretKey, salt, 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { encrypted, iv: iv.toString('hex') };
}

module.exports = aesEncrypt;
