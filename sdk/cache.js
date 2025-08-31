const cacheStore = {};
const TTL = 30 * 24 * 60 * 60 * 1000; // 30 days in ms

function get(username) {
  const entry = cacheStore[username];
  if (!entry) return null;
  const now = Date.now();
  if (now - entry.timestamp > TTL) {
    delete cacheStore[username];
    return null;
  }
  return entry;
}

function set(username, token, accessKey) {
  cacheStore[username] = { token, accessKey, timestamp: Date.now() };
}

module.exports = { get, set };
