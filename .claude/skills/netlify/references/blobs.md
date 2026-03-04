# Netlify Blobs Reference

Netlify Blobs is a key-value store for any kind of data, available in builds, functions, and Edge Functions.

## Installation

```bash
npm install @netlify/blobs
```

## Store Types

### Global Store (Strongly Consistent)

Use for runtime data that needs immediate consistency across all requests.

```typescript
import { getStore } from "@netlify/blobs";

const store = getStore("my-store");
```

### Deploy-Specific Store (Eventually Consistent)

Use for build-time data that doesn't change after deploy. Better performance.

```typescript
import { getDeployStore } from "@netlify/blobs";

const store = getDeployStore("my-store");
```

## Core Operations

### Set Data

```typescript
// Set string/binary data
await store.set("key", "value");
await store.set("key", new Blob(["data"]));
await store.set("key", new ArrayBuffer(8));

// Set with metadata
await store.set("key", "value", { metadata: { author: "user1" } });

// Set JSON (automatically serialized)
await store.setJSON("key", { name: "example", count: 42 });
```

### Get Data

```typescript
// Get as string
const value = await store.get("key");

// Get as specific type
const blob = await store.get("key", { type: "blob" });
const buffer = await store.get("key", { type: "arrayBuffer" });
const stream = await store.get("key", { type: "stream" });

// Get JSON (automatically parsed)
const data = await store.getJSON("key");

// Get with metadata
const { data, metadata } = await store.getWithMetadata("key");

// Get metadata only (separate scope)
const metadataOnly = await store.getMetadata("key");
```

### Delete Data

```typescript
// Delete single key
await store.delete("key");

// Delete all keys in store (use with caution)
await store.deleteAll();
```

### List Keys

```typescript
// List all keys
const { blobs } = await store.list();
// Returns: [{ key: "key1", etag: "..." }, { key: "key2", etag: "..." }]

// List with prefix
const { blobs } = await store.list({ prefix: "users/" });

// List with pagination
const { blobs, cursor } = await store.list({ paginate: true });
if (cursor) {
  const nextPage = await store.list({ paginate: true, cursor });
}

// List with directories (hierarchical)
const { blobs, directories } = await store.list({ directories: true });
```

### List Stores

```typescript
import { listStores } from "@netlify/blobs";

const { stores } = await listStores();
// Returns: [{ name: "store1" }, { name: "store2" }]
```

## Configuration Options

### Store Options

```typescript
const store = getStore({
  name: "my-store",
  consistency: "strong",  // or "eventual"
  siteID: "site-id",      // optional, for cross-site access
  token: process.env.NETLIFY_TOKEN,  // optional, never hardcode tokens
});
```

### Operation Options

```typescript
// Set with cache control
await store.set("key", "value", {
  metadata: { type: "config" },
});

// Get with specific type
const data = await store.get("key", {
  type: "json",      // "text" | "json" | "blob" | "arrayBuffer" | "stream"
  consistency: "strong",
});
```

## Use Cases

### Caching API Responses

```typescript
export default async (request: Request) => {
  const store = getStore("api-cache");
  const cacheKey = new URL(request.url).pathname;

  // Check cache
  const cached = await store.get(cacheKey);
  if (cached) return new Response(cached);

  // Fetch and cache
  const response = await fetch("https://api.example.com/data");
  const data = await response.text();
  await store.set(cacheKey, data);

  return new Response(data);
};
```

### User Sessions

```typescript
export default async (request: Request) => {
  const store = getStore("sessions");
  const sessionId = request.headers.get("x-session-id");

  if (!sessionId) {
    return new Response("Missing session ID", { status: 401 });
  }

  // Get session
  const session = await store.getJSON(sessionId);

  // Update session
  await store.setJSON(sessionId, {
    ...session,
    lastAccess: Date.now(),
  });

  return new Response(JSON.stringify(session));
};
```

### Build-Time Data

```typescript
// In build script
import { getDeployStore } from "@netlify/blobs";

const store = getDeployStore("build-data");
await store.setJSON("config", buildConfig);

// In Edge Function (read-only)
const store = getDeployStore("build-data");
const config = await store.getJSON("config");
```

### File Storage

```typescript
// Upload file
const file = new Blob([fileContent], { type: "image/png" });
await store.set("images/photo.png", file, {
  metadata: { contentType: "image/png", size: file.size },
});

// Download file
const blob = await store.get("images/photo.png", { type: "blob" });
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NETLIFY_BLOBS_CONTEXT` | Auto-set in Netlify environment |
| `SITE_ID` | Site identifier for store access |
| `DEPLOY_ID` | Deploy identifier for deploy stores |

## Best Practices

1. **Choose the right store type**: Use deploy stores for static data, global stores for dynamic data
2. **Use prefixes for organization**: Group related keys with prefixes like `users/`, `cache/`
3. **Set appropriate metadata**: Include content type, timestamps, or other useful info
4. **Handle missing keys**: `get()` returns `null` for non-existent keys
5. **Paginate large lists**: Use `paginate: true` for stores with many keys
6. **Clean up old data**: Implement TTL logic or periodic cleanup for cache data

## Limits

- Maximum key size: 600 bytes
- Maximum value size: 5 MB (functions), 50 MB (builds)
- Maximum metadata size: 2 KB
- Rate limits apply based on plan

## Related

- [Netlify Blobs Documentation](https://docs.netlify.com/blobs/overview/)
- [Edge Functions](./functions-edge.md)
- [Build Configuration](./build-configuration.md)
