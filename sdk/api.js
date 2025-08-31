require('dotenv').config();
const axios = require('axios');

/**
 * Authorize user via Superadmin API
 * @param {Object} data
 * @returns {Promise<Object>} { token, encryptedAccessKey, metadata }
 */
async function authorize(data) {
  // Replace with actual Superadmin API endpoint
  const url = process.env.SUPERADMIN_API_URL || 'https://superadmin.example.com/api/auth';
  const res = await axios.post(url, data);
  return res.data;
}

module.exports = { authorize };
