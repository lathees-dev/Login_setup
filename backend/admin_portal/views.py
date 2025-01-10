from django.shortcuts import render
from django.db.models import Max
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .models import RoadmapModule, Chapter
from .serializers import RoadmapModuleSerializer, ChapterSerializer


class RoadmapModuleViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = RoadmapModule.objects.all().order_by("position")
    serializer_class = RoadmapModuleSerializer

    def list(self, request):
        modules = self.get_queryset()
        serializer = self.get_serializer(modules, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        # Auto-increment position for new modules
        last_position = (
            RoadmapModule.objects.all().aggregate(Max("position"))["position__max"] or 0
        )
        serializer.save(position=last_position + 1)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def update_module_positions(request):
    positions = request.data
    for module_id, position in positions.items():
        RoadmapModule.objects.filter(id=module_id).update(position=position)
    return Response({"status": "positions updated"})
