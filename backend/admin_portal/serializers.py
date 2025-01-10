from rest_framework import serializers
from .models import RoadmapModule, Chapter


class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ["id", "title", "content", "video_url", "image_url", "order"]


class RoadmapModuleSerializer(serializers.ModelSerializer):
    chapters = ChapterSerializer(many=True, read_only=True)

    class Meta:
        model = RoadmapModule
        fields = ["id", "title", "position", "is_locked", "chapters"]
