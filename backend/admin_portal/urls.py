from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"modules", views.RoadmapModuleViewSet, basename="module")

urlpatterns = [
    path("admin/", include(router.urls)),
    path("admin/modules/update-positions/", views.update_module_positions),
]
