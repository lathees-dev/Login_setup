from django.urls import path
from . import views

app_name = 'storyTelling'

urlpatterns = [
    path('api/story-feedback/', views.story_feedback, name='story-feedback'),
    path('api/chat-with-assistant/', views.chat_with_assistant, name='chat-with-assistant'),
    path('api/get-test-situation/', views.get_test_situation, name='get-test-situation'),
    path('api/submit-test/', views.submit_test, name='submit-test'),
]
