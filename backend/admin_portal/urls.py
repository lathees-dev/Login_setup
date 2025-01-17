from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"modules", views.RoadmapModuleViewSet, basename="module")

urlpatterns = [
    path("admin/", include(router.urls)),
    path("admin/modules/update-positions/", views.update_module_positions),
    path("users-admin/", views.UserAdminView.as_view(), name="user_admin_view"),
    path("users-admin/progress/<str:user_id>/", views.UserProgressView.as_view(), name="user_progress"),
]
