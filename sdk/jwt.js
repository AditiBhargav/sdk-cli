require('dotenv').config();
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'default_secret';

function generate(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '30d' });
}

function validateToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (e) {
    return null;
  }
}

function isValid(token) {
  return !!validateToken(token);
}

module.exports = { generate, validateToken, isValid };
