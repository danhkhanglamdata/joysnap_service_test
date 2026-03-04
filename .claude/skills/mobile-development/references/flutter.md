# Flutter Development

Complete guide to Flutter development with Dart (2024-2025).

## Overview

- **Language**: Dart
- **Stars**: 170,000+ GitHub (fastest-growing)
- **Adoption**: 46% of mobile developers
- **Performance**: 85-95% native
- **Rendering**: Impeller engine (eliminates jank)
- **Platforms**: iOS, Android, Web, Desktop (Windows, macOS, Linux)

## Quick Start

```bash
# Install Flutter
# macOS
brew install flutter

# Verify installation
flutter doctor

# Create new project
flutter create my_app
cd my_app
flutter run
```

## Project Structure

```
lib/
├── main.dart                 # Entry point
├── features/
│   ├── auth/
│   │   ├── data/            # Repositories, data sources
│   │   ├── domain/          # Entities, use cases
│   │   └── presentation/    # Screens, widgets, state
│   └── home/
├── core/
│   ├── theme/               # App theme, colors, typography
│   ├── utils/               # Helpers, extensions
│   ├── widgets/             # Shared widgets
│   └── constants/           # App constants
├── routing/                 # Navigation configuration
└── services/                # API, storage, etc.
```

## Dart Essentials

### Null Safety
```dart
String? nullableString;           // Can be null
String nonNullableString = '';    // Cannot be null

// Null-aware operators
String result = nullableString ?? 'default';
int? length = nullableString?.length;
String forced = nullableString!;  // Force unwrap (use carefully)
```

### Async/Await
```dart
Future<User> fetchUser(String id) async {
  final response = await api.get('/users/$id');
  return User.fromJson(response.data);
}

// Error handling
try {
  final user = await fetchUser('123');
} catch (e) {
  print('Error: $e');
}
```

### Classes and Constructors
```dart
class User {
  final String id;
  final String name;
  final String? email;

  // Named constructor
  const User({
    required this.id,
    required this.name,
    this.email,
  });

  // Factory constructor
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'],
      email: json['email'],
    );
  }

  // Copyable pattern
  User copyWith({String? name, String? email}) {
    return User(
      id: id,
      name: name ?? this.name,
      email: email ?? this.email,
    );
  }
}
```

## Widget Basics

### Stateless Widget
```dart
class UserCard extends StatelessWidget {
  final User user;
  final VoidCallback onTap;

  const UserCard({
    super.key,
    required this.user,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(user.name),
        subtitle: Text(user.email ?? ''),
        onTap: onTap,
      ),
    );
  }
}
```

### Stateful Widget
```dart
class Counter extends StatefulWidget {
  const Counter({super.key});

  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _count = 0;

  void _increment() {
    setState(() {
      _count++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Count: $_count'),
        ElevatedButton(
          onPressed: _increment,
          child: const Text('Increment'),
        ),
      ],
    );
  }
}
```

## Layout Widgets

### Column & Row
```dart
Column(
  mainAxisAlignment: MainAxisAlignment.center,
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    Text('Title'),
    SizedBox(height: 8),
    Text('Subtitle'),
  ],
)

Row(
  mainAxisAlignment: MainAxisAlignment.spaceBetween,
  children: [
    Icon(Icons.star),
    Text('Rating'),
    Text('4.5'),
  ],
)
```

### Container & Padding
```dart
Container(
  width: 200,
  height: 100,
  padding: EdgeInsets.all(16),
  margin: EdgeInsets.symmetric(horizontal: 8),
  decoration: BoxDecoration(
    color: Colors.blue,
    borderRadius: BorderRadius.circular(8),
    boxShadow: [
      BoxShadow(
        color: Colors.black26,
        blurRadius: 4,
        offset: Offset(0, 2),
      ),
    ],
  ),
  child: Text('Content'),
)
```

### ListView
```dart
// Simple list
ListView(
  children: [
    ListTile(title: Text('Item 1')),
    ListTile(title: Text('Item 2')),
  ],
)

// Builder (lazy loading - recommended for long lists)
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return ListTile(title: Text(items[index].name));
  },
)

// Separated
ListView.separated(
  itemCount: items.length,
  separatorBuilder: (_, __) => Divider(),
  itemBuilder: (context, index) {
    return ListTile(title: Text(items[index].name));
  },
)
```

## State Management

### Riverpod 3 (Recommended)
```dart
// pubspec.yaml
dependencies:
  flutter_riverpod: ^2.5.0
  riverpod_annotation: ^2.3.0

dev_dependencies:
  riverpod_generator: ^2.4.0
  build_runner: ^2.4.0
```

```dart
// Provider definition
@riverpod
class Counter extends _$Counter {
  @override
  int build() => 0;

  void increment() => state++;
  void decrement() => state--;
}

// Async provider
@riverpod
Future<List<User>> users(UsersRef ref) async {
  final repository = ref.watch(userRepositoryProvider);
  return repository.getUsers();
}

// Usage in widget
class CounterScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);

    return Scaffold(
      body: Center(child: Text('Count: $count')),
      floatingActionButton: FloatingActionButton(
        onPressed: () => ref.read(counterProvider.notifier).increment(),
        child: Icon(Icons.add),
      ),
    );
  }
}
```

### Bloc Pattern
```dart
// Events
abstract class AuthEvent {}
class LoginRequested extends AuthEvent {
  final String email;
  final String password;
  LoginRequested(this.email, this.password);
}

// States
abstract class AuthState {}
class AuthInitial extends AuthState {}
class AuthLoading extends AuthState {}
class AuthSuccess extends AuthState {
  final User user;
  AuthSuccess(this.user);
}
class AuthFailure extends AuthState {
  final String error;
  AuthFailure(this.error);
}

// Bloc
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository repository;

  AuthBloc(this.repository) : super(AuthInitial()) {
    on<LoginRequested>(_onLoginRequested);
  }

  Future<void> _onLoginRequested(
    LoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    try {
      final user = await repository.login(event.email, event.password);
      emit(AuthSuccess(user));
    } catch (e) {
      emit(AuthFailure(e.toString()));
    }
  }
}
```

## Navigation (GoRouter)

```dart
// pubspec.yaml
dependencies:
  go_router: ^14.0.0
```

```dart
final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => HomeScreen(),
    ),
    GoRoute(
      path: '/user/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return UserScreen(userId: id);
      },
    ),
    ShellRoute(
      builder: (context, state, child) => MainLayout(child: child),
      routes: [
        GoRoute(path: '/home', builder: (_, __) => HomeTab()),
        GoRoute(path: '/profile', builder: (_, __) => ProfileTab()),
      ],
    ),
  ],
);

// Usage
context.go('/user/123');
context.push('/details');
context.pop();
```

## HTTP & API

### Dio (Recommended)
```dart
// pubspec.yaml
dependencies:
  dio: ^5.4.0
```

```dart
class ApiClient {
  final Dio _dio;

  ApiClient() : _dio = Dio(BaseOptions(
    baseUrl: 'https://api.example.com',
    connectTimeout: Duration(seconds: 5),
    receiveTimeout: Duration(seconds: 3),
  )) {
    _dio.interceptors.add(LogInterceptor());
  }

  Future<List<User>> getUsers() async {
    final response = await _dio.get('/users');
    return (response.data as List)
        .map((json) => User.fromJson(json))
        .toList();
  }

  Future<User> createUser(User user) async {
    final response = await _dio.post('/users', data: user.toJson());
    return User.fromJson(response.data);
  }
}
```

## Local Storage

### SharedPreferences
```dart
// Simple key-value storage
final prefs = await SharedPreferences.getInstance();
await prefs.setString('token', 'abc123');
final token = prefs.getString('token');
```

### Hive (Fast NoSQL)
```dart
// pubspec.yaml
dependencies:
  hive: ^2.2.3
  hive_flutter: ^1.1.0
```

```dart
// Initialize
await Hive.initFlutter();
await Hive.openBox<User>('users');

// Usage
final box = Hive.box<User>('users');
await box.put('user1', user);
final user = box.get('user1');
```

## Testing

### Unit Tests
```dart
// test/user_repository_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

void main() {
  late UserRepository repository;
  late MockApiClient mockApi;

  setUp(() {
    mockApi = MockApiClient();
    repository = UserRepository(mockApi);
  });

  test('getUsers returns list of users', () async {
    when(mockApi.getUsers()).thenAnswer(
      (_) async => [User(id: '1', name: 'Test')],
    );

    final users = await repository.getUsers();

    expect(users.length, 1);
    expect(users.first.name, 'Test');
  });
}
```

### Widget Tests
```dart
testWidgets('Counter increments', (WidgetTester tester) async {
  await tester.pumpWidget(MaterialApp(home: Counter()));

  expect(find.text('0'), findsOneWidget);

  await tester.tap(find.byIcon(Icons.add));
  await tester.pump();

  expect(find.text('1'), findsOneWidget);
});
```

### Integration Tests
```dart
// integration_test/app_test.dart
import 'package:integration_test/integration_test.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('full app test', (tester) async {
    await tester.pumpWidget(MyApp());
    await tester.pumpAndSettle();

    await tester.tap(find.text('Login'));
    await tester.pumpAndSettle();

    expect(find.text('Welcome'), findsOneWidget);
  });
}
```

## Performance Optimization

### Const Widgets
```dart
// ✅ Good - compile-time constant
const Text('Hello');
const SizedBox(height: 8);
const EdgeInsets.all(16);

// ❌ Bad - recreated every build
Text('Hello');
SizedBox(height: 8);
```

### Keys for Lists
```dart
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return UserCard(
      key: ValueKey(items[index].id),  // ✅ Helps Flutter identify widgets
      user: items[index],
    );
  },
)
```

### RepaintBoundary
```dart
// Isolate expensive widgets from repaints
RepaintBoundary(
  child: ExpensiveAnimatedWidget(),
)
```

### Image Optimization
```dart
// Use cached_network_image
CachedNetworkImage(
  imageUrl: url,
  placeholder: (_, __) => CircularProgressIndicator(),
  errorWidget: (_, __, ___) => Icon(Icons.error),
)
```

## Common Packages

| Package | Purpose |
|---------|---------|
| `flutter_riverpod` | State management |
| `go_router` | Navigation |
| `dio` | HTTP client |
| `freezed` | Immutable classes |
| `hive` | Local database |
| `cached_network_image` | Image caching |
| `flutter_hooks` | React-like hooks |
| `intl` | Internationalization |
| `flutter_secure_storage` | Secure storage |

## Build & Deploy

```bash
# Run in debug
flutter run

# Run in release
flutter run --release

# Build APK
flutter build apk --release

# Build iOS
flutter build ios --release

# Build App Bundle (Play Store)
flutter build appbundle

# Analyze code
flutter analyze

# Run tests
flutter test
```

## Resources

- Official Docs: https://flutter.dev/docs
- Pub.dev: https://pub.dev/
- Widget Catalog: https://flutter.dev/widgets
- Codelabs: https://flutter.dev/codelabs
- Awesome Flutter: https://github.com/Solido/awesome-flutter
