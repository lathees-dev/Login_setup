from pathlib import Path
from decouple import config
import os
from corsheaders.defaults import default_headers

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Add this line - it tells Django where to find the root URLconf
ROOT_URLCONF = "backend.urls"

SECRET_KEY = "django-insecure-your-secret-key-here"  # For development only

# For production, use environment variable:
# SECRET_KEY = config('SECRET_KEY')

DEBUG = True


INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "users",
    "storyTelling",
    "admin_portal",
    "rest_framework",
    "communication",
    "vocabulary",
    "grammar",
    "videoResume",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# DATABASES = {
#     'default': {
#         'ENGINE': 'djongo',
#         'NAME': 'login_system',
#         'HOST': 'localhost',
#         'PORT': 27017,
#     }
# }

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

STATIC_URL = "static/"

STATIC_ROOT = BASE_DIR / "staticfiles"

# Email Configuration
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = config("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

# For debugging email issues
if DEBUG:
    EMAIL_DEBUG = True
    import logging

    logging.getLogger("django.mail").setLevel(logging.DEBUG)

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
    }
}

# Add these settings for media files
MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

# Add these MongoDB settings to your settings.py

# MongoDB Configuration
MONGODB_URI = "mongodb+srv://sutgJxLaXWo7gKMR:sutgJxLaXWo7gKMR@cluster0.2ytii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
MONGODB_NAME = "login_system"

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Your frontend URL
]

# If you want to allow specific headers
CORS_ALLOW_HEADERS = list(default_headers) + [
    "your-custom-header",
]
