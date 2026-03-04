# FastAPI

## Description

FastAPI web framework with async patterns, Pydantic v2 validation, SQLAlchemy 2.0, and OpenAPI documentation.

## Version

FastAPI 0.115.x (December 2024) with Pydantic v2, Python 3.10-3.13

## When to Use

- Building REST APIs with Python
- Async web applications
- OpenAPI/Swagger documentation needed
- High-performance API services
- WebSocket applications
- Background task processing

---

## What's New

### FastAPI 0.121+ Features
- **Dependency Scopes**: Control when `yield` dependencies exit
  - `scope="request"` (default): Exit after response sent
  - `scope="function"`: Exit before response sent (new)
- **FastAPI Cloud CLI**: Deploy with `fastapi deploy` command
- **Wrapped Dependencies**: Support for `functools.wraps` decorated functions
- **functools.partial**: Use partial functions as dependables

### Pydantic v2 Support
- 5-50x faster validation
- New `model_dump()` replaces `dict()`
- New `model_validate()` replaces `parse_obj()`
- Improved type hints

### Python 3.11-3.13 Features
- Exception groups
- TaskGroups for concurrent tasks
- Improved error messages
- Better performance

---

## Project Structure

```
app/
├── main.py              # FastAPI app entry
├── config.py            # Settings and configuration
├── models/              # SQLAlchemy models
│   ├── __init__.py
│   └── user.py
├── schemas/             # Pydantic schemas
│   ├── __init__.py
│   └── user.py
├── routers/             # API routes
│   ├── __init__.py
│   └── users.py
├── services/            # Business logic
│   ├── __init__.py
│   └── user_service.py
├── repositories/        # Data access
│   ├── __init__.py
│   └── user_repository.py
├── dependencies/        # Dependency injection
│   ├── __init__.py
│   └── database.py
└── middleware/          # Custom middleware
    └── __init__.py
```

---

## Core Patterns

### Basic Application

```python
from fastapi import FastAPI
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting up...")
    yield
    # Shutdown
    print("Shutting down...")

app = FastAPI(
    title="My API",
    description="API description",
    version="1.0.0",
    lifespan=lifespan
)

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

### Pydantic v2 Schemas

```python
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserUpdate(BaseModel):
    email: EmailStr | None = None
    name: str | None = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    is_active: bool = True

    # Pydantic v2 config
    model_config = ConfigDict(
        from_attributes=True,  # Replaces orm_mode
        json_schema_extra={
            "example": {
                "id": 1,
                "email": "user@example.com",
                "name": "John Doe",
                "created_at": "2025-01-01T00:00:00Z",
                "is_active": True
            }
        }
    )
```

### Route Definition

```python
from fastapi import FastAPI, HTTPException, Depends, status, Query, Path
from typing import Annotated

app = FastAPI()

@app.post(
    "/users",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new user",
    tags=["users"]
)
async def create_user(user: UserCreate):
    """
    Create a new user with the following information:
    
    - **email**: unique email address
    - **name**: display name
    - **password**: secure password (min 8 chars)
    """
    # Create user logic
    return UserResponse(id=1, **user.model_dump(exclude={"password"}))

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: Annotated[int, Path(gt=0, description="User ID")],
):
    user = await get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@app.get("/users", response_model=list[UserResponse])
async def list_users(
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 10,
    search: str | None = None,
):
    return await get_users(skip=skip, limit=limit, search=search)
```

### Dependency Injection

```python
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated, AsyncGenerator

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise

# Type alias for cleaner code
DbSession = Annotated[AsyncSession, Depends(get_db)]

# Dependency with scope (0.121+)
async def get_db_early_exit() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session
        # Exits BEFORE response is sent
        await session.commit()

DbSessionEarly = Annotated[AsyncSession, Depends(get_db_early_exit, scope="function")]

@app.get("/users")
async def list_users(db: DbSession):
    result = await db.execute(select(User))
    return result.scalars().all()
```

### Authentication Dependency

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from typing import Annotated

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: DbSession,
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await db.get(User, user_id)
    if user is None:
        raise credentials_exception
    return user

CurrentUser = Annotated[User, Depends(get_current_user)]

@app.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: CurrentUser):
    return current_user
```

### Router Organization

```python
# routers/users.py
from fastapi import APIRouter

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
async def list_users():
    pass

@router.get("/{user_id}")
async def get_user(user_id: int):
    pass

# main.py
from routers import users, posts, auth

app.include_router(users.router)
app.include_router(posts.router)
app.include_router(auth.router, prefix="/auth", tags=["auth"])
```

---

## SQLAlchemy 2.0 Async

### Models

```python
from sqlalchemy import String, ForeignKey, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from datetime import datetime

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    hashed_password: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    
    # Relationships
    posts: Mapped[list["Post"]] = relationship(back_populates="author")

class Post(Base):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    content: Mapped[str]
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    
    author: Mapped["User"] = relationship(back_populates="posts")
```

### Database Setup

```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

DATABASE_URL = "postgresql+asyncpg://user:pass@localhost/db"

engine = create_async_engine(DATABASE_URL, echo=True)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
```

### Repository Pattern

```python
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

class UserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, user_id: int) -> User | None:
        return await self.session.get(User, user_id)

    async def get_by_email(self, email: str) -> User | None:
        result = await self.session.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()

    async def get_all(
        self, 
        skip: int = 0, 
        limit: int = 10
    ) -> list[User]:
        result = await self.session.execute(
            select(User).offset(skip).limit(limit)
        )
        return list(result.scalars().all())

    async def create(self, user_data: UserCreate) -> User:
        user = User(**user_data.model_dump())
        self.session.add(user)
        await self.session.flush()
        await self.session.refresh(user)
        return user

    async def update(self, user: User, user_data: UserUpdate) -> User:
        update_data = user_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        await self.session.flush()
        await self.session.refresh(user)
        return user

    async def delete(self, user: User) -> None:
        await self.session.delete(user)
```

---

## Middleware

### Custom Middleware

```python
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import time

class TimingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.perf_counter()
        response = await call_next(request)
        process_time = time.perf_counter() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        return response

app.add_middleware(TimingMiddleware)
```

### CORS Middleware

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Background Tasks

```python
from fastapi import BackgroundTasks

async def send_email(email: str, message: str):
    # Simulate sending email
    await asyncio.sleep(2)
    print(f"Email sent to {email}: {message}")

@app.post("/users")
async def create_user(
    user: UserCreate,
    background_tasks: BackgroundTasks,
):
    # Create user
    new_user = await user_service.create(user)
    
    # Queue background task
    background_tasks.add_task(
        send_email,
        user.email,
        "Welcome to our platform!"
    )
    
    return new_user
```

---

## WebSocket

```python
from fastapi import WebSocket, WebSocketDisconnect
from typing import List

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"Client #{client_id}: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"Client #{client_id} left")
```

---

## Error Handling

```python
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse

class AppException(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "type": "app_error"},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )
```

---

## Testing

```python
import pytest
from httpx import AsyncClient, ASGITransport
from main import app

@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac

@pytest.mark.asyncio
async def test_create_user(client: AsyncClient):
    response = await client.post(
        "/users",
        json={"email": "test@example.com", "name": "Test", "password": "password123"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"

@pytest.mark.asyncio
async def test_get_user_not_found(client: AsyncClient):
    response = await client.get("/users/999")
    assert response.status_code == 404
```

---

## Configuration

```python
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    app_name: str = "My API"
    debug: bool = False
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    model_config = ConfigDict(env_file=".env")

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
```

---

## Best Practices

1. **Use Pydantic v2 features** - `model_dump()`, `model_validate()`, `ConfigDict`
2. **Organize routes with APIRouter** - Group related endpoints
3. **Use dependency injection** - For services, repositories, auth
4. **Return proper HTTP status codes** - 201 for create, 204 for delete
5. **Add OpenAPI descriptions** - Docstrings, summaries, examples
6. **Use async everywhere** - Async DB, async HTTP clients
7. **Implement proper error handling** - Custom exceptions, global handlers
8. **Use type hints** - `Annotated`, `|` for unions
9. **Background tasks for slow operations** - Email, notifications
10. **Repository pattern for data access** - Separation of concerns

## Common Pitfalls

- **Blocking I/O in async**: Use async libraries (asyncpg, httpx, aiofiles)
- **Missing response models**: Always define them for documentation
- **No error handling**: Use HTTPException properly
- **Pydantic v1 syntax**: Use v2 methods (`model_dump` not `dict`)
- **N+1 queries**: Use `selectinload` for relationships
- **Missing validation**: Use Pydantic Field constraints
- **Wrong dependency scope**: Use `scope="function"` when cleanup must happen before response

## Commands

```bash
# Development
uv run uvicorn main:app --reload

# Production
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

# Deploy to FastAPI Cloud (0.116+)
uv run fastapi deploy

# Testing
uv run pytest -v

# Linting
uv run ruff check .
uv run ruff format .
```

## Resources

- FastAPI Docs: https://fastapi.tiangolo.com
- Pydantic v2: https://docs.pydantic.dev/latest/
- SQLAlchemy 2.0: https://docs.sqlalchemy.org/en/20/
