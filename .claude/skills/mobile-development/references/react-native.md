# React Native Development

Complete guide to React Native development with TypeScript (2024-2025).

## Overview

- **Language**: JavaScript/TypeScript
- **Stars**: 121,000+ GitHub
- **Adoption**: 35% of mobile developers, 67% familiarity
- **Performance**: 80-90% native
- **Architecture**: New Architecture (JSI, Fabric, Turbo Modules)
- **Platforms**: iOS, Android, (Web via React Native Web)

## Quick Start

```bash
# Create new project with Expo (recommended)
npx create-expo-app@latest my-app
cd my-app
npx expo start

# Or with React Native CLI
npx @react-native-community/cli init MyApp
cd MyApp
npm run ios  # or npm run android
```

## Project Structure

```
src/
├── app/                    # Screens/routes (Expo Router)
│   ├── (tabs)/            # Tab navigation group
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Home screen
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── stores/
│   └── profile/
├── shared/
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Helper functions
│   └── constants/         # App constants
├── services/              # API, storage
└── stores/                # Global state (Zustand)
```

## TypeScript Essentials

```typescript
// Types
interface User {
  id: string;
  name: string;
  email?: string;  // Optional
}

// Props typing
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

// Generic components
interface ListProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
}
```

## Components

### Functional Component
```typescript
import { View, Text, StyleSheet } from 'react-native';

interface UserCardProps {
  user: User;
  onPress: () => void;
}

export function UserCard({ user, onPress }: UserCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
});
```


### Hooks
```typescript
import { useState, useEffect, useCallback } from 'react';

// Custom hook
function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getUsers();
      setUsers(response);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}
```

## Layout Components

### View, Text, ScrollView
```typescript
import { View, Text, ScrollView, SafeAreaView } from 'react-native';

function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>Left</Text>
          <Text>Right</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
```

### FlatList (Virtualized)
```typescript
import { FlatList } from 'react-native';

function UserList({ users }: { users: User[] }) {
  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <UserCard user={item} />}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      ListEmptyComponent={<Text>No users found</Text>}
      refreshing={loading}
      onRefresh={refetch}
    />
  );
}
```

## State Management

### Zustand (Recommended)
```typescript
// stores/useAuthStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async (email, password) => {
        const { user, token } = await api.login(email, password);
        set({ user, token });
      },
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Usage in component
function Profile() {
  const { user, logout } = useAuthStore();
  return <Button title="Logout" onPress={logout} />;
}
```

### React Query (Server State)
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.getUsers(),
  });
}

function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (user: CreateUserDto) => api.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

## Navigation (Expo Router)

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="user/[id]" options={{ title: 'User Details' }} />
    </Stack>
  );
}

// app/index.tsx
import { Link } from 'expo-router';

export default function Home() {
  return (
    <Link href="/user/123">Go to User</Link>
  );
}

// app/user/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function UserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Text>User ID: {id}</Text>;
}
```

### Tab Navigation
```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
```


## HTTP & API

### Axios
```typescript
// services/api.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
```

## Local Storage

### AsyncStorage
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store data
await AsyncStorage.setItem('user', JSON.stringify(user));

// Retrieve data
const userJson = await AsyncStorage.getItem('user');
const user = userJson ? JSON.parse(userJson) : null;

// Remove data
await AsyncStorage.removeItem('user');
```

### Expo SecureStore
```typescript
import * as SecureStore from 'expo-secure-store';

// Store sensitive data (tokens, passwords)
await SecureStore.setItemAsync('token', token);

// Retrieve
const token = await SecureStore.getItemAsync('token');

// Delete
await SecureStore.deleteItemAsync('token');
```

## Styling

### StyleSheet
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,  // React Native 0.71+
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
```

### NativeWind (Tailwind CSS)
```typescript
// With NativeWind
import { View, Text } from 'react-native';

function Card() {
  return (
    <View className="p-4 bg-white rounded-lg shadow-md">
      <Text className="text-lg font-semibold text-gray-900">Title</Text>
      <Text className="text-sm text-gray-600">Description</Text>
    </View>
  );
}
```

## Testing

### Jest + React Native Testing Library
```typescript
import { render, fireEvent, waitFor } from '@testing-library/react-native';

describe('LoginScreen', () => {
  it('should enable login button when form is valid', async () => {
    const { getByTestId } = render(<LoginScreen />);

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');

    await waitFor(() => {
      expect(getByTestId('login-button')).not.toBeDisabled();
    });
  });
});
```

### Detox E2E
```typescript
// e2e/login.test.ts
describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should login successfully', async () => {
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();
    
    await expect(element(by.text('Welcome'))).toBeVisible();
  });
});
```

## Performance

### Memoization
```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoize component
const UserCard = memo(function UserCard({ user }: { user: User }) {
  return <Text>{user.name}</Text>;
});

// Memoize expensive computation
const sortedUsers = useMemo(
  () => users.sort((a, b) => a.name.localeCompare(b.name)),
  [users]
);

// Memoize callback
const handlePress = useCallback(() => {
  navigation.navigate('Details', { id: user.id });
}, [user.id]);
```

### Image Optimization
```typescript
import FastImage from 'react-native-fast-image';

<FastImage
  source={{ uri: imageUrl, priority: FastImage.priority.normal }}
  style={{ width: 100, height: 100 }}
  resizeMode={FastImage.resizeMode.cover}
/>
```

## Common Packages

| Package | Purpose |
|---------|---------|
| `expo-router` | File-based navigation |
| `zustand` | State management |
| `@tanstack/react-query` | Server state |
| `axios` | HTTP client |
| `nativewind` | Tailwind CSS |
| `react-native-fast-image` | Image caching |
| `expo-secure-store` | Secure storage |
| `react-hook-form` | Form handling |
| `zod` | Validation |

## Build & Deploy

```bash
# Development
npx expo start

# Build for iOS (Expo)
eas build --platform ios

# Build for Android (Expo)
eas build --platform android

# Build APK locally
npx expo run:android --variant release

# Build iOS locally
npx expo run:ios --configuration Release

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## Resources

- Official Docs: https://reactnative.dev/
- Expo Docs: https://docs.expo.dev/
- React Navigation: https://reactnavigation.org/
- React Native Directory: https://reactnative.directory/
- Awesome React Native: https://github.com/jondot/awesome-react-native
