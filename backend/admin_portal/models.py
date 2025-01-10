from django.db import models


class RoadmapModule(models.Model):
    title = models.CharField(max_length=200)
    position = models.IntegerField()
    is_locked = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Chapter(models.Model):
    module = models.ForeignKey(
        RoadmapModule, related_name="chapters", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=200)
    content = models.TextField()
    video_url = models.URLField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    order = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
