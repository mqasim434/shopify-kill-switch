# Shopify Kill Switch

Backend that stores a store URL + boolean flag in Firebase Firestore, and exposes an API to read it.

## Setup

1. Create a Firebase project and enable **Firestore**.
2. Project settings → Service accounts → **Generate new private key** → save as `serviceAccountKey.json` in the project root (gitignored).
3. Copy env file and point at the key:

```bash
cp .env.example .env
```

4. Install & run:

```bash
npm install
npm run dev
```

## Deploy on Railway

Do **not** upload `serviceAccountKey.json`. Use an env var instead:

1. In Railway → your service → **Variables**
2. **Delete** `FIREBASE_SERVICE_ACCOUNT_PATH` if it exists
3. Add `FIREBASE_SERVICE_ACCOUNT_JSON` with the **entire** contents of `serviceAccountKey.json` as a **single line**

PowerShell helper to copy a one-line JSON value:

```powershell
(Get-Content .\serviceAccountKey.json -Raw) -replace '\r?\n',' ' | Set-Clipboard
```

Or base64 (also works with the same env var name):

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("$PWD\serviceAccountKey.json")) | Set-Clipboard
```

4. Redeploy

## API

### Save / update a store

```http
POST /stores
Content-Type: application/json

{
  "storeUrl": "https://example.myshopify.com",
  "enabled": true
}
```

### Get all stores

```http
GET /stores
```

Response:

```json
{
  "stores": [
    { "storeUrl": "example.myshopify.com", "enabled": true },
    { "storeUrl": "other.myshopify.com", "enabled": false }
  ],
  "count": 2
}
```

### Get one store + flag

```http
GET /stores?storeUrl=example.myshopify.com
```

Response:

```json
{ "storeUrl": "example.myshopify.com", "enabled": true }
```

### Get boolean only

```http
GET /stores/status?storeUrl=example.myshopify.com
```

Response:

```json
{ "enabled": true }
```

### Health

```http
GET /health
```
