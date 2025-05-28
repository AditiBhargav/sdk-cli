function base64Encode(data) {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

module.exports = base64Encode;
