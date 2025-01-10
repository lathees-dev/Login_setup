from django.urls import path
from . import views

app_name = 'grammar'

urlpatterns = [
    path('api/options/', views.get_grammar_options, name='options'),
] 