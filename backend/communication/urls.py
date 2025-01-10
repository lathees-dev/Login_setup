from django.urls import path
from . import views

app_name = 'communication'

urlpatterns = [
    path('api/options/', views.get_communication_options, name='options'),
] 