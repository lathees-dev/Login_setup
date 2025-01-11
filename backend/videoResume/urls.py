from django.urls import path
from .views import upload_video, results

app_name = "videoResume"

urlpatterns = [
    path("upload/", upload_video, name="upload_video"),
    path("results/<int:resume_transcription_id>/", results, name="results"),
]
