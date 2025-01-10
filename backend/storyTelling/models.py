from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class StoryTest(models.Model):
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        null=True,  # Allow null for anonymous users
        blank=True
    )
    situation_id = models.IntegerField()
    audio_file = models.FileField(upload_to='story_tests/')
    score = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        username = self.user.name if self.user else "Anonymous"
        return f"Test by {username} - Situation {self.situation_id}"
