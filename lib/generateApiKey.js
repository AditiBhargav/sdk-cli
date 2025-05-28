const fs = require('fs');
const pool = require('../config/dbClient');
const aesEncrypt = require('../encryption/aesEncrypt');
const base64Encode = require('../encryption/base64Encode');
const { generateRandomString, generateKeyName } = require('../utils/generateRandoms');
const { v4: uuidv4 } = require('uuid');

async function generateApiKey(inputPath = './data/input.json') {
  const rawData = JSON.parse(fs.readFileSync(inputPath));
  const ea_key = uuidv4();
  const salt = generateRandomString(16);
  const secretKey = generateRandomString(32);
  const key_name = generateKeyName();

  const { account_id } = rawData.account_details;
  const payload = { ...rawData.account_details, ...rawData.product_details };
  const { encrypted, iv } = aesEncrypt(JSON.stringify(payload), secretKey, salt);

  const apiKeyObj = {
    ea_key,
    key_name,
    salt,
    iv,
    secretKey,
    encrypted
  };

  const api_key = base64Encode(apiKeyObj);

  await pool.query(
    'INSERT INTO encoded_api_keys (ea_key, customer_id, key_name, api_key) VALUES ($1, $2, $3, $4)',
    [ea_key, account_id, key_name, api_key]
  );

  return {
    ea_key,
    key_name,
    api_key,
    payload
  };
}

module.exports = { generateApiKey };
