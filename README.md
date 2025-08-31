# SDK Authentication Project

## Overview
This SDK provides secure authentication and access key management for two systems (Vsync and Superadmin) using JWT-based authentication, AES encryption, and a 30-day TTL cache. All operations are dynamic and API-driven, with no direct database linking.

## Project Flow

### First-Time Login
1. **Entry Point:**
   - `index.js` is the main entry for the SDK. It exposes the `login` function.
2. **Login Logic:**
   - `auth.js` checks the cache for a valid JWT and access key.
   - If not found, it generates a random access key (if not provided) and reads metadata from `data/input.json`.
3. **Validation:**
   - `validation.js` encrypts the access key using AES and sends it, along with metadata, to the Superadmin API.
   - On success, receives a JWT, decrypted access key, and metadata.
4. **Caching:**
   - `auth.js` stores the JWT and access key in the cache for 30 days (TTL).
5. **Return:**
   - Returns JWT, access key, and metadata to Vsync for further use and saving in the DB via API.

### Future Logins
1. **Cache Check:**
   - On subsequent logins, `auth.js` checks the cache for a valid JWT and access key.
2. **TTL Validation:**
   - If the cache is valid (TTL not expired), returns cached data.
   - If expired, repeats the first-time login flow.

## Key Files and Folders
- `sdk/index.js`: Main SDK entry point.
- `sdk/auth.js`: Handles login logic and cache check.
- `sdk/validation.js`: Encrypts access key, calls Superadmin API, decrypts response, and handles metadata.
- `sdk/cache.js`: Stores JWT and access key with TTL logic.
- `sdk/encryptKey.js` & `sdk/decryptKey.js`: AES encryption/decryption of access key.
- `sdk/api.js`: Handles API calls to Superadmin.
- `sdk/jwt.js`: JWT generation and validation.
- `utils/generateRandoms.js`: Generates random access keys and key names.
- `data/input.json`: Stores metadata used during login and validation.

## Security Features
- **AES Encryption:** Access keys are encrypted using AES-256-CBC and base64 encoding.
- **JWT Authentication:** Secure, standardized authentication tokens.
- **TTL Cache:** Reduces API load by caching session data for 30 days.
- **No Direct DB Access:** All data storage and retrieval is handled via API calls.

## Usage
1. Import the SDK in your system.
2. Call the `login` function with username, password, and (optionally) access key.
3. On first login, SDK handles encryption, validation, and caching.
4. On future logins, SDK checks cache and returns data if valid.

## Example
```js
const sdk = require('./sdk');

// First-time login
sdk.login('username', 'password')
  .then(({ token, accessKey, metadata }) => {
    // Use token, accessKey, and metadata as needed
  })
  .catch(console.error);
```

## API Integration
- All validation and data storage is performed via API calls to Superadmin and Vsync backends.
- Metadata from `input.json` is included in the authentication flow and can be saved in the DB via API after validation.

## Cleanup
Remove any unused files or folders not listed above for a clean, maintainable SDK.

---
For further details or integration help, see the source code or contact the maintainer.
