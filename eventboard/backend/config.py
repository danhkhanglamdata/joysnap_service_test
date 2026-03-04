import os
from functools import lru_cache


class Settings:
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_anon_key: str = os.getenv("SUPABASE_ANON_KEY", "")
    supabase_service_role_key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    app_url: str = os.getenv("APP_URL", "http://localhost:3000")
    environment: str = os.getenv("ENVIRONMENT", "development")

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
