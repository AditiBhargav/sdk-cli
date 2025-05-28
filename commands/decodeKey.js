#!/usr/bin/env node

const readline = require('readline');
const pool = require('../config/dbClient');
const base64Decode = require('../decryption/base64Decode');
const aesDecrypt = require('../decryption/aesDecrypt');

(async () => {
  const chalk = (await import('chalk')).default;
  const boxen = (await import('boxen')).default;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(chalk.yellow('Enter Key Name to decode: '), async (inputKeyName) => {
    const key_name = inputKeyName.trim();

    try {
      const result = await pool.query('SELECT * FROM encoded_api_keys WHERE key_name = $1', [key_name]);
      
      if (result.rows.length === 0) {
        console.log(chalk.red.bold('\n❌ Key Name not found in database.\n'));
        rl.close();
        return;
      }

      const encodedKey = result.rows[0].api_key;
      const decoded = base64Decode(encodedKey);
      const decrypted = aesDecrypt(decoded.encrypted, decoded.secretKey, decoded.salt, decoded.iv);
      const parsed = JSON.parse(decrypted);

      await pool.query(
        `INSERT INTO decoded_api_keys (
          ea_key, customer_id, email_id, product_name,
          no_of_users, compare_quotation, two_way_reconciliation,
          three_way_reconciliation, ai_tokens_monthly, total_pdf_pages_monthly
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          decoded.ea_key,
          parsed.account_id,
          parsed.email_id,
          parsed.product_name,
          parsed.subscription.features.no_of_users,
          parsed.subscription.features.compare_quotation,
          parsed.subscription.features.two_way_reconciliation,
          parsed.subscription.features.three_way_reconciliation,
          parsed.subscription.features.AI_tokens_monthly,
          parsed.subscription.features.total_pdf_pages_monthly
        ]
      );

      console.log(boxen(
        chalk.green.bold('Decrypted Data:') +
        `\n\nAccount ID: ${parsed.account_id}\nEmail     : ${parsed.email_id}\nProduct   : ${parsed.product_name}\n\nSubscription Features:\n${JSON.stringify(parsed.subscription.features, null, 2)}`,
        { padding: 1, borderColor: 'green', margin: 1 }
      ));

    } catch (error) {
      console.error(chalk.red('Error decoding API key:'), error);
    } finally {
      rl.close();
    }
  });
})();
