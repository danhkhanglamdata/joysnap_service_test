# React

## Description

React 18 component patterns, hooks, Server Components, and state management best practices.

## Version

React 18.3.x (December 2024) - Stable & Secure

## When to Use

- Building React components
- Using React hooks
- Component state management
- Server Components patterns (with Next.js)
- Form handling

---

## Core Patterns

### Functional Components

```tsx
interface UserCardProps {
  user: User;
  onSelect?: (user: User) => void;
}

export function UserCard({ user, onSelect }: UserCardProps) {
  return (
    <div className="card" onClick={() => onSelect?.(user)}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}
```

### Essential Hooks

```tsx
// useState
const [count, setCount] = useState(0);

// useEffect
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, [dependency]);

// useMemo
const expensive = useMemo(() => compute(data), [data]);

// useCallback
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// useRef
const inputRef = useRef<HTMLInputElement>(null);

// useReducer
const [state, dispatch] = useReducer(reducer, initialState);

// useId (React 18)
const id = useId();
```

---

## React 18 Features

### Concurrent Rendering

```tsx
// Automatic batching - multiple state updates batched automatically
function handleClick() {
  setCount(c => c + 1);  // Batched
  setFlag(f => !f);       // Batched
  // Only one re-render
}

// useTransition - mark updates as non-urgent
function SearchResults() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');

  function handleChange(e) {
    // Urgent: show what was typed
    setQuery(e.target.value);
    
    // Non-urgent: show results
    startTransition(() => {
      setSearchResults(filterResults(e.target.value));
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending ? <Spinner /> : <Results />}
    </>
  );
}
```

### useDeferredValue

```tsx
function SearchResults({ query }) {
  // Defers updating until urgent updates are done
  const deferredQuery = useDeferredValue(query);
  
  const results = useMemo(
    () => filterResults(deferredQuery),
    [deferredQuery]
  );

  return <ResultsList results={results} />;
}
```

### Suspense for Data Fetching

```tsx
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <UserProfile />
    </Suspense>
  );
}

// With lazy loading
const LazyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
}
```

### useId for Accessibility

```tsx
function FormField({ label }) {
  const id = useId();
  
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </>
  );
}
```

---

## Server Components (Next.js)

```tsx
// Server Component (default in Next.js App Router)
// Can directly access databases, file system, etc.
async function UserList() {
  const users = await db.users.findMany(); // Direct DB access
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Client Component - add 'use client' directive
'use client';

import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### Server vs Client Components

| Feature | Server Component | Client Component |
|---------|------------------|------------------|
| Fetch data | ✅ Direct DB/API | ❌ Via API routes |
| Access backend | ✅ Yes | ❌ No |
| useState/useEffect | ❌ No | ✅ Yes |
| Event handlers | ❌ No | ✅ Yes |
| Browser APIs | ❌ No | ✅ Yes |
| Bundle size | ✅ Zero JS | ❌ Adds to bundle |

---

## Forms with Server Actions (Next.js)

### Server Actions

```tsx
// actions.ts
'use server';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  await db.posts.create({ data: { title, content } });
  revalidatePath('/posts');
}
```

```tsx
// Component using Server Action
import { createPost } from './actions';

export function CreatePostForm() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="Title" />
      <textarea name="content" placeholder="Content" />
      <button type="submit">Create Post</button>
    </form>
  );
}
```

### Form with useFormState (React 18 + Next.js)

```tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useFormState(submitForm, null);

  return (
    <form action={formAction}>
      <input name="email" type="email" placeholder="Email" />
      <SubmitButton />
      {state?.error && <p className="error">{state.error}</p>}
    </form>
  );
}
```

---

## Ref Handling

```tsx
import { forwardRef, useRef } from 'react';

// Forward ref to child component
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} />;
});

// Usage
function Form() {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <>
      <Input ref={inputRef} placeholder="Enter text" />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}
```

---

## Custom Hooks

```tsx
function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetchUser(id)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { user, loading, error };
}

// Usage
function UserProfile({ userId }: { userId: string }) {
  const { user, loading, error } = useUser(userId);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>User not found</div>;
  
  return <div>{user.name}</div>;
}
```

---

## Context Pattern

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => setUser(user);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## Error Boundaries

```tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Error caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<div>Something went wrong</div>}>
  <MyComponent />
</ErrorBoundary>
```

---

## Best Practices

1. **Use Server Components by default** - Only add 'use client' when needed
2. **Keep components small and focused** - Single responsibility
3. **Use TypeScript for props** - Better DX and type safety
4. **Use useTransition for non-urgent updates** - Better UX
5. **Memoize expensive computations** - useMemo, useCallback
6. **Clean up effects properly** - Return cleanup function
7. **Lift state up when needed** - Share state between components
8. **Use Suspense for loading states** - Better UX patterns
9. **Colocate related code** - Keep components and hooks together
10. **Use forwardRef for ref forwarding** - Required in React 18

## Common Pitfalls

- **Missing dependencies in hooks**: Include all dependencies in arrays
- **State updates on unmounted**: Use cleanup functions
- **Prop drilling**: Use context or composition
- **Missing forwardRef**: Required when passing refs to custom components
- **Hooks in Server Components**: Only use in Client Components
- **Blocking renders**: Use useTransition for expensive updates

## Resources

- React Docs: https://react.dev
- React 18 Blog: https://react.dev/blog/2022/03/29/react-v18
- Server Components: https://react.dev/reference/rsc/server-components
