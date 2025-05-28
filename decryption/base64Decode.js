function base64Decode(encodedData) {
  return JSON.parse(Buffer.from(encodedData, 'base64').toString('utf-8'));
}

module.exports = base64Decode;
