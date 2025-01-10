from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("users/", include("users.urls")),
    path("storytelling/", include("storyTelling.urls", namespace="storyTelling")),
    path("api/", include("admin_portal.urls")),
    path('communication/', include('communication.urls', namespace='communication')),
    path('vocabulary/', include('vocabulary.urls', namespace='vocabulary')),
    path('grammar/', include('grammar.urls', namespace='grammar')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
