from django.db import models


# Create your models here.
class Transcription(models.Model):
    video_file = models.FileField(upload_to="video_resumes/")
    transcription_text = models.TextField(blank=True, null=True)
    evaluation_result = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.video_file.name
