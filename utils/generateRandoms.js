const crypto = require('crypto');

function generateRandomString(length) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

function generateKeyName() {
  return crypto.randomBytes(10).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 15);
}

module.exports = { generateRandomString, generateKeyName };
