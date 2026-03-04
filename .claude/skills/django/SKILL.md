# Django

## Description

Django web framework with ORM, views, and REST framework patterns.

## Version

Django 5.1.x (stable) / 4.2.x LTS (December 2024)

## When to Use

- Python web applications
- Admin interfaces
- Django REST Framework APIs

---

## Core Patterns

### Models

```python
from django.db import models

class User(models.Model):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.email
```

### Views (Class-based)

```python
from django.views.generic import ListView, DetailView

class UserListView(ListView):
    model = User
    template_name = 'users/list.html'
    context_object_name = 'users'
    paginate_by = 20

class UserDetailView(DetailView):
    model = User
    template_name = 'users/detail.html'
```

### Django REST Framework

```python
from rest_framework import serializers, viewsets

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'created_at']

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
```

### URLs

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('users', UserViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
```

## Best Practices

1. Use class-based views for standard CRUD
2. Define model methods for business logic
3. Use serializers for validation
4. Add proper permissions
5. Use select_related/prefetch_related for queries

## Common Pitfalls

- **N+1 queries**: Use select_related/prefetch_related
- **Missing migrations**: Run makemigrations
- **No validation**: Use serializers properly
