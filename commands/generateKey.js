#!/usr/bin/env node

const fs = require('fs');
const pool = require('../config/dbClient');
const aesEncrypt = require('../encryption/aesEncrypt');
const base64Encode = require('../encryption/base64Encode');
const { generateRandomString, generateKeyName } = require('../utils/generateRandoms');
const { v4: uuidv4 } = require('uuid');

(async () => {
  const chalk = (await import('chalk')).default;
  const boxen = (await import('boxen')).default;

  async function generateApiKey() {
    const rawData = JSON.parse(fs.readFileSync('./data/input.json'));
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

    console.log(boxen(chalk.blue.bold('Input Metadata (from input.json):') + '\n\n' + JSON.stringify(payload, null, 2), {
      padding: 1,
      borderColor: 'blue'
    }));

    console.log(boxen(chalk.green.bold('API Key Generated:') +
      `\n\nEA Key     : ${ea_key}\nKey Name   : ${key_name}\nAPI Key    :\n${api_key}`, {
        padding: 1,
        borderColor: 'green',
        margin: 1,
      }));
  }

  generateApiKey();
})();
