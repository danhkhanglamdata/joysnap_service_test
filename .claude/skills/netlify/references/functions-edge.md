# Netlify Functions & Edge Functions

## Serverless Functions

### Overview

Netlify Functions are serverless functions that run on AWS Lambda. They're ideal for:
- API endpoints
- Form handling
- Database operations
- Third-party API integrations
- Authentication

### Directory Structure

```
project/
├── netlify/
│   └── functions/
│       ├── hello.js
│       ├── api/
│       │   └── users.js
│       └── utils/
│           └── db.js
└── netlify.toml
```

### Basic Function (JavaScript)

```javascript
// netlify/functions/hello.js
export default async (req, context) => {
  const name = new URL(req.url).searchParams.get("name") || "World";

  return new Response(JSON.stringify({ message: `Hello, ${name}!` }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
```

### Basic Function (TypeScript)

```typescript
// netlify/functions/hello.ts
import type { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  const name = new URL(req.url).searchParams.get("name") || "World";

  return new Response(JSON.stringify({ message: `Hello, ${name}!` }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
```

### Request Handling

```typescript
// netlify/functions/api.ts
import type { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  // Get HTTP method
  const method = req.method;

  // Get URL and path
  const url = new URL(req.url);
  const path = url.pathname;

  // Get query parameters
  const params = url.searchParams;
  const id = params.get("id");

  // Get headers
  const authHeader = req.headers.get("Authorization");

  // Get body (for POST/PUT)
  if (method === "POST" || method === "PUT") {
    const body = await req.json();
    // Process body...
  }

  // Route handling
  switch (method) {
    case "GET":
      return new Response(JSON.stringify({ data: "..." }));
    case "POST":
      return new Response(JSON.stringify({ created: true }), { status: 201 });
    case "DELETE":
      return new Response(null, { status: 204 });
    default:
      return new Response("Method not allowed", { status: 405 });
  }
};
```

### Context Object

```typescript
export default async (req: Request, context: Context) => {
  // Geolocation data
  const { city, country, timezone } = context.geo;

  // Client IP
  const ip = context.ip;

  // Request ID
  const requestId = context.requestId;

  // Site information
  const siteUrl = context.site.url;

  // Account information
  const accountId = context.account.id;

  // Deploy information
  const deployId = context.deploy.id;
  const deployContext = context.deploy.context; // "production", "deploy-preview", etc.

  return new Response(JSON.stringify({
    location: `${city}, ${country}`,
    timezone,
    ip
  }));
};
```

### Environment Variables in Functions

```typescript
export default async (req: Request, context: Context) => {
  // Access environment variables
  const apiKey = process.env.API_KEY;
  const dbUrl = process.env.DATABASE_URL;

  // Netlify-specific env vars
  const siteId = process.env.SITE_ID;
  const deployId = process.env.DEPLOY_ID;
  const context = process.env.CONTEXT; // "production", "deploy-preview", etc.

  return new Response("OK");
};
```

### Scheduled Functions

```typescript
// netlify/functions/scheduled-task.ts
import type { Config } from "@netlify/functions";

export default async () => {
  // Run scheduled task
  console.log("Running scheduled task...");

  // Perform cleanup, send emails, etc.

  return new Response("Task completed");
};

// Schedule configuration
export const config: Config = {
  schedule: "0 0 * * *" // Run daily at midnight (cron syntax)
};
```

### Background Functions

```typescript
// netlify/functions/background-task.ts
import type { Config } from "@netlify/functions";

export default async (req: Request) => {
  // Long-running task (up to 15 minutes)
  const data = await req.json();

  // Process data...
  await processLargeDataset(data);

  return new Response("Processing started");
};

export const config: Config = {
  type: "background"
};
```

---

## Edge Functions

### Overview

Edge Functions run on Deno at the edge (close to users). They're ideal for:
- Personalization
- A/B testing
- Authentication/authorization
- Geolocation-based content
- Request/response modification

### Directory Structure

```
project/
├── netlify/
│   └── edge-functions/
│       ├── middleware.ts
│       ├── geolocation.ts
│       └── auth.ts
└── netlify.toml
```

### Basic Edge Function

```typescript
// netlify/edge-functions/hello.ts
import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  return new Response("Hello from the Edge!");
};

export const config = {
  path: "/hello"
};
```

### Geolocation Example

```typescript
// netlify/edge-functions/geolocation.ts
import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const { city, country, latitude, longitude, timezone } = context.geo;

  return new Response(JSON.stringify({
    message: `Hello from ${city}, ${country}!`,
    coordinates: { latitude, longitude },
    timezone
  }), {
    headers: { "Content-Type": "application/json" }
  });
};

export const config = {
  path: "/geo"
};
```

### Middleware Pattern

```typescript
// netlify/edge-functions/middleware.ts
import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  // Get the response from the origin
  const response = await context.next();

  // Modify response headers
  response.headers.set("X-Custom-Header", "Hello from Edge");
  response.headers.set("X-Geo-Country", context.geo.country || "unknown");

  return response;
};

export const config = {
  path: "/*"
};
```

### Request Rewriting

```typescript
// netlify/edge-functions/rewrite.ts
import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);

  // Rewrite based on country
  if (context.geo.country === "DE") {
    url.pathname = `/de${url.pathname}`;
    return context.rewrite(url);
  }

  return context.next();
};

export const config = {
  path: "/*",
  excludedPath: ["/de/*", "/static/*"]
};
```

### A/B Testing

```typescript
// netlify/edge-functions/ab-test.ts
import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  // Check for existing cookie
  const cookies = request.headers.get("cookie") || "";
  const variant = cookies.includes("ab_variant=B") ? "B" :
                  cookies.includes("ab_variant=A") ? "A" :
                  Math.random() < 0.5 ? "A" : "B";

  // Rewrite to variant
  const url = new URL(request.url);
  url.pathname = `/variants/${variant}${url.pathname}`;

  const response = await context.rewrite(url);

  // Set cookie if new visitor
  if (!cookies.includes("ab_variant=")) {
    response.headers.append("Set-Cookie", `ab_variant=${variant}; Path=/; Max-Age=86400`);
  }

  return response;
};

export const config = {
  path: "/experiment/*"
};
```

### Authentication

```typescript
// netlify/edge-functions/auth.ts
import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = authHeader.substring(7);

  try {
    // Verify token (example with JWT)
    const isValid = await verifyToken(token);

    if (!isValid) {
      return new Response("Invalid token", { status: 403 });
    }

    // Continue to origin
    return context.next();
  } catch (error) {
    return new Response("Authentication error", { status: 500 });
  }
};

export const config = {
  path: "/api/protected/*"
};

async function verifyToken(token: string): Promise<boolean> {
  // Token verification logic
  return true;
}
```

### Edge Function Configuration

```typescript
// Inline configuration
export const config = {
  path: "/api/*",                    // Path pattern
  excludedPath: ["/api/public/*"],   // Excluded paths
  cache: "manual",                   // Cache control
  onError: "bypass"                  // Error handling
};
```

```toml
# netlify.toml configuration
[[edge_functions]]
  path = "/api/*"
  function = "api-handler"
  excludedPath = ["/api/public/*"]

[[edge_functions]]
  path = "/*"
  function = "middleware"
  excludedPath = ["/static/*", "/_next/*"]
```

---

## Comparison: Functions vs Edge Functions

| Feature | Serverless Functions | Edge Functions |
|---------|---------------------|----------------|
| Runtime | Node.js | Deno |
| Location | AWS regions | Edge (global) |
| Cold start | Higher | Lower |
| Execution time | Up to 26s (background: 15min) | Up to 50ms |
| Use case | API, DB, heavy compute | Personalization, auth, rewrites |
| Pricing | Per invocation | Per invocation |

## Best Practices

### Functions
- Keep functions small and focused
- Use environment variables for secrets
- Handle errors gracefully
- Use TypeScript for type safety
- Cache responses when possible

### Edge Functions
- Keep execution time minimal (<50ms)
- Avoid heavy computation
- Use for request/response modification
- Leverage geolocation for personalization
- Cache aggressively
