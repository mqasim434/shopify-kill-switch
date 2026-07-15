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
