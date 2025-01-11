from django.contrib import admin
from django.urls import path, include
from users import views

urlpatterns = [
   
    path('api/register/', views.register_user, name='register'),
    path('api/login/', views.login_user, name='login'),
    path('api/forgot-password/', views.forgot_password, name='forgot-password'),
    path('api/verify-otp/', views.verify_otp, name='verify-otp'),
    path('api/test-db/', views.test_db, name='test-db'),
    path('api/send-signup-otp/', views.send_signup_otp, name='send-signup-otp'),
    path('api/verify-signup-otp/', views.verify_signup_otp, name='verify-signup-otp'),
    path('api/send-reset-otp/', views.send_reset_otp, name='send-reset-otp'),
    path('api/verify-reset-otp/', views.verify_reset_otp, name='verify-reset-otp'),
    path('api/reset-password/', views.reset_password, name='reset-password'),
    path('api/send-mobile-otp/', views.send_mobile_otp, name='send-mobile-otp'),
    path('api/verify-mobile-otp/', views.verify_mobile_otp, name='verify-mobile-otp'),
    path('api/test-email/', views.test_email, name='test-email'),
    path('api/update-profile/', views.update_profile, name='update-profile'),
    # path('api/story-feedback/', views.story_feedback, name='story-feedback'),
    # path('api/chat-with-assistant/', views.chat_with_assistant, name='chat-with-assistant'),
    path('stats/', views.get_user_stats, name='user-stats'),
    path('all/', views.get_all_users, name='all-users'),
    path('<int:user_id>/', views.delete_user, name='delete-user'),
    path('api/roadmap/', views.get_roadmap, name='get-roadmap'),
    path('api/roadmap/save/', views.save_roadmap, name='save-roadmap'),
]
