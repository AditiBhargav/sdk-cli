#!/usr/bin/env node

const fs = require('fs');
const pool = require('../config/dbClient');
const aesEncrypt = require('../encryption/aesEncrypt');
const base64Encode = require('../encryption/base64Encode');
const { generateRandomString, generateKeyName } = require('../utils/generateRandoms');
const { v4: uuidv4 } = require('uuid');
const { generateApiKey } = require('../lib/generateApiKey');

(async () => {
  async function run() {
    const chalk = (await import('chalk')).default;
    const boxen = (await import('boxen')).default;
    const result = await generateApiKey();
    const { ea_key, key_name, api_key, payload } = result;

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

  run();
})();
