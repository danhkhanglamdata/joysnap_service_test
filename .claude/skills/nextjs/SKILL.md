---
name: nextjs
description: Build modern full-stack web applications with Next.js 15 (App Router, Server Components, RSC, PPR, SSR, SSG, ISR, async APIs), Turborepo (monorepo management, task pipelines, remote caching, parallel execution), and RemixIcon (3100+ SVG icons). Use when creating React applications, implementing server-side rendering, setting up monorepos, optimizing build performance, or working with TypeScript full-stack projects.
license: MIT
version: 2.0.0
---

# Next.js Skill

Comprehensive guide for building modern full-stack web applications using Next.js 15, Turborepo, and RemixIcon.

## Overview

This skill combines three powerful tools for web development:

- **Next.js 15** - React framework with SSR, SSG, RSC, async APIs, and React 18.3.x support
- **Turborepo** - High-performance monorepo build system for JavaScript/TypeScript
- **RemixIcon** - Icon library with 3,100+ outlined and filled style icons

## What's New in Next.js 15

### Breaking Changes (v15)
- **Async Request APIs**: `cookies()`, `headers()`, `params`, `searchParams` are now async
- **React 18.3+ Required**: Minimum `react` and `react-dom` version is 18.3 (avoid React 19.0 due to security vulnerabilities)

### New Features (v15)
- **React 18.3.x Support**: Full integration with React 18 features (stable & secure)
- **"use cache" Directive**: Component-level caching
- **after()**: Post-response execution
- **connection()**: Request-aware rendering
- **Partial Prerendering (PPR)**: Combine static and dynamic content
- **Turbopack Filesystem Caching**: Experimental `turbopackFileSystemCacheForDev` for faster dev restarts

## When to Use

- Building React applications with SSR/SSG
- Full-stack applications with App Router
- Setting up monorepos with multiple apps and shared packages
- Implementing server-side rendering and static generation
- Optimizing build performance with intelligent caching

## Quick Start

### Single Application

```bash
npx create-next-app@latest my-app
cd my-app
npm install remixicon
npm run dev
```

### Monorepo with Turborepo

```bash
npx create-turbo@latest my-monorepo
cd my-monorepo
npm run dev
```

### Upgrade from v14 to v15

```bash
# Automated upgrade (recommended)
npx @next/codemod@canary upgrade latest

# Manual upgrade
npm install next@latest react@latest react-dom@latest
```

---

## Core Patterns

### App Router Structure

```
app/
├── layout.tsx          # Root layout
├── page.tsx            # Home page
├── loading.tsx         # Loading UI (Suspense boundary)
├── error.tsx           # Error UI
├── not-found.tsx       # 404 page
├── api/
│   └── users/
│       └── route.ts    # API route
└── users/
    ├── page.tsx        # Users page
    └── [id]/
        └── page.tsx    # User detail (dynamic route)
```

### Server Components (Default)

```tsx
// app/users/page.tsx - Server Component (default)
async function UsersPage() {
  const users = await db.users.findMany();

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default UsersPage;
```

### Client Components

```tsx
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### Async Request APIs (v15+ Breaking Change)

```tsx
// BEFORE (v14) - Synchronous
import { cookies } from 'next/headers';

export default function Page() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  return <div>Token: {token?.value}</div>;
}

// AFTER (v15+) - Asynchronous
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  return <div>Token: {token?.value}</div>;
}
```

### Dynamic Params (v15+ Async)

```tsx
// BEFORE (v14)
export default function Page({ params }: { params: { id: string } }) {
  return <div>ID: {params.id}</div>;
}

// AFTER (v15+)
export default async function Page({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  return <div>ID: {id}</div>;
}
```

### Search Params (v15+ Async)

```tsx
// AFTER (v15+)
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>
}) {
  const { query } = await searchParams;
  return <div>Search: {query}</div>;
}
```

### API Routes

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const users = await db.users.findMany();
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const user = await db.users.create({ data });
  return NextResponse.json(user, { status: 201 });
}
```

### Server Actions with useFormState (React 18)

```tsx
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createUser(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  
  try {
    await db.users.create({ data: { name } });
    revalidatePath('/users');
    return { success: true, message: 'User created!' };
  } catch (error) {
    return { success: false, message: 'Failed to create user' };
  }
}
```

```tsx
// app/users/create/page.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createUser } from '../actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create User'}
    </button>
  );
}

export default function CreateUserPage() {
  const [state, formAction] = useFormState(createUser, null);

  return (
    <form action={formAction}>
      <input name="name" placeholder="Name" />
      <SubmitButton />
      {state?.message && <p>{state.message}</p>}
    </form>
  );
}
```

### Turbopack Filesystem Caching (v15)

```typescript
// next.config.ts - Enable faster dev restarts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
}

export default nextConfig
```

### "use cache" Directive (v15)

```tsx
// Component-level caching
async function CachedData() {
  'use cache';
  
  const data = await fetchExpensiveData();
  return <div>{data}</div>;
}

// With cache lifetime
async function CachedWithLifetime() {
  'use cache';
  cacheLife('hours'); // 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks'
  
  const data = await fetchData();
  return <div>{data}</div>;
}
```

### after() - Post-Response Execution (v15)

```tsx
import { after } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  
  // Process and respond immediately
  const result = await processData(data);
  
  // Run after response is sent (analytics, logging, etc.)
  after(async () => {
    await logAnalytics(data);
    await sendNotification(result);
  });
  
  return Response.json(result);
}
```

### connection() - Request-Aware Rendering (v15)

```tsx
import { connection } from 'next/server';

export default async function Page() {
  // Wait for connection before accessing request-specific data
  await connection();
  
  // Now safe to access cookies, headers, etc.
  const cookieStore = await cookies();
  
  return <div>...</div>;
}
```

### Partial Prerendering (PPR)

```tsx
// next.config.js
module.exports = {
  experimental: {
    ppr: true,
  },
};

// app/page.tsx - Static shell with dynamic holes
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      {/* Static - prerendered at build time */}
      <header>Welcome to My App</header>
      
      {/* Dynamic - rendered at request time */}
      <Suspense fallback={<div>Loading user...</div>}>
        <UserProfile />
      </Suspense>
      
      {/* Static */}
      <footer>© 2025</footer>
    </div>
  );
}

async function UserProfile() {
  const user = await getCurrentUser(); // Dynamic data
  return <div>{user.name}</div>;
}
```

---

## Data Fetching Patterns

### Fetch with Caching

```tsx
// Cached by default (static)
const data = await fetch('https://api.example.com/data');

// Revalidate every 60 seconds
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 60 }
});

// No caching (dynamic)
const data = await fetch('https://api.example.com/data', {
  cache: 'no-store'
});

// Revalidate on demand
const data = await fetch('https://api.example.com/data', {
  next: { tags: ['posts'] }
});

// In server action:
import { revalidateTag } from 'next/cache';
revalidateTag('posts');
```

### Parallel Data Fetching

```tsx
async function Page() {
  // Parallel fetching - much faster
  const [users, posts] = await Promise.all([
    fetchUsers(),
    fetchPosts()
  ]);

  return (
    <div>
      <UserList users={users} />
      <PostList posts={posts} />
    </div>
  );
}
```

---

## Monorepo Pattern

### Structure

```
my-monorepo/
├── apps/
│   ├── web/              # Customer-facing Next.js app
│   ├── admin/            # Admin dashboard
│   └── docs/             # Documentation site
├── packages/
│   ├── ui/               # Shared UI with RemixIcon
│   ├── api-client/       # API client library
│   ├── config/           # ESLint, TypeScript configs
│   └── types/            # Shared TypeScript types
└── turbo.json            # Build pipeline
```

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

---

## RemixIcon Integration

```tsx
// Webfont (HTML/CSS)
<i className="ri-home-line"></i>
<i className="ri-search-fill ri-2x"></i>

// React component
import { RiHomeLine, RiSearchFill } from "@remixicon/react"
<RiHomeLine size={24} />
<RiSearchFill size={32} color="blue" />
```

---

## Metadata & SEO

```tsx
// Static metadata
export const metadata = {
  title: 'My App',
  description: 'App description',
  openGraph: {
    title: 'My App',
    description: 'App description',
    images: ['/og-image.png'],
  },
};

// Dynamic metadata
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  
  return {
    title: product.name,
    description: product.description,
  };
}
```

---

## Best Practices

**Next.js 15:**
- Use Server Components by default, Client Components only when needed
- Add 'use client' only for interactivity (hooks, event handlers)
- Always `await` async APIs: `cookies()`, `headers()`, `params`, `searchParams`
- Use `useFormState` with `useFormStatus` for form handling
- Colocate data fetching with components
- Use loading.tsx for suspense boundaries
- Implement proper error boundaries
- Set proper metadata for SEO
- Use PPR for optimal performance

**Turborepo:**
- Structure monorepo with clear separation (apps/, packages/)
- Define task dependencies correctly (^build for topological)
- Configure outputs for proper caching
- Enable remote caching for team collaboration

**RemixIcon:**
- Use line style for minimal interfaces, fill for emphasis
- Provide aria-labels for accessibility
- Use currentColor for flexible theming

## Common Pitfalls

- **Sync access to async APIs (v15+)**: Always await `cookies()`, `headers()`, etc.
- **Using hooks in Server Components**: Mark as 'use client'
- **Large client bundles**: Keep client components small
- **Missing loading states**: Add loading.tsx files
- **Missing useFormStatus**: Use with useFormState for pending states

## Migration Checklist (v14 → v15)

- [ ] Update `next` to v15, `react` and `react-dom` to 18.3.x (avoid React 19.0)
- [ ] Update `@types/react`, `@types/react-dom`
- [ ] Add `await` to all `cookies()` calls
- [ ] Add `await` to all `headers()` calls
- [ ] Update `params` prop to `Promise<>` type and await
- [ ] Update `searchParams` prop to `Promise<>` type and await
- [ ] Use `useFormState` and `useFormStatus` for forms
- [ ] Test all dynamic routes

## Resources

- Next.js: https://nextjs.org/docs
- Upgrade Guide: https://nextjs.org/docs/app/building-your-application/upgrading
- Turborepo: https://turbo.build/repo/docs
- RemixIcon: https://remixicon.com
