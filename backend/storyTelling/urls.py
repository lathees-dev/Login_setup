from django.urls import path
from . import views

app_name = 'storyTelling'

urlpatterns = [
    path('api/story-feedback/', views.story_feedback, name='story-feedback'),
    path('api/chat-with-assistant/', views.chat_with_assistant, name='chat-with-assistant'),
]
