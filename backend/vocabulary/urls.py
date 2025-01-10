from django.urls import path
from . import views

app_name = 'vocabulary'

urlpatterns = [
    path('api/options/', views.get_vocabulary_options, name='options'),
    path('api/generate-question/', views.generate_vocabulary_question, name='generate-question'),
    path('api/test/', views.generate_vocabulary_test, name='generate-test'),  # New path for test

] 