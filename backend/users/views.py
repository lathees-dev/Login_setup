from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
from django.core.mail import send_mail
from datetime import datetime, timedelta
from django.conf import settings
from .models import CustomUser
from pymongo.errors import ConnectionFailure, OperationFailure
from .mongodb import users_collection, admins_collection, db
import logging
import random

# Set up logging
logger = logging.getLogger(__name__)

@api_view(['POST'])
def register_user(request):
    try:
        logger.info("Registration request data: %s", request.data)
        name = request.data.get('name')
        email = request.data.get('email')
        mobile_number = request.data.get('mobile_number')
        password = request.data.get('password')
        user_type = request.data.get('user_type', 'user')
        
        logger.info("Processing registration for user_type: %s", user_type)
        
        # Validate required fields
        if not all([name, email, mobile_number, password]):
            missing = [field for field in ['name', 'email', 'mobile_number', 'password'] 
                      if not request.data.get(field)]
            return Response(
                {'error': f'Missing required fields: {", ".join(missing)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if email already exists
        existing_user = CustomUser.get_user_by_email(email, 'user')
        existing_admin = CustomUser.get_user_by_email(email, 'admin')
        
        if existing_user or existing_admin:
            return Response(
                {'error': 'Email already registered'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create user/admin
        result = CustomUser.create_user(name, email, mobile_number, password, user_type)
        logger.info("User created with ID: %s", result.inserted_id)
        
        return Response(
            {
                'message': f'{user_type.capitalize()} registered successfully',
                'user_type': user_type,
                'id': str(result.inserted_id)
            }, 
            status=status.HTTP_201_CREATED
        )
    except Exception as e:
        logger.error("Registration error: %s", str(e), exc_info=True)
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
def login_user(request):
    try:
        logger.info("Login request data: %s", request.data)
        email = request.data.get('email')
        password = request.data.get('password')
        user_type = request.data.get('user_type', 'user')
        
        if not email or not password:
            return Response(
                {'error': 'Email and password are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        user = CustomUser.get_user_by_email(email, user_type)
        logger.info("Found user: %s", bool(user))
        
        if not user:
            return Response(
                {'error': 'Invalid credentials'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if check_password(password, user['password']):
            response_data = {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email'],
                'user_type': user_type
            }
            logger.info("Login successful for user: %s", email)
            return Response(response_data)
        
        logger.warning("Invalid password for user: %s", email)
        return Response(
            {'error': 'Invalid credentials'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error("Login error: %s", str(e), exc_info=True)
        return Response(
            {'error': 'Login failed'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def forgot_password(request):
    email = request.data.get('email')
    user = CustomUser.get_user_by_email(email)
    
    if not user:
        return Response(
            {'error': 'Email not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    otp = CustomUser.generate_otp(email)
    
    # Send OTP via email
    send_mail(
        'Password Reset OTP',
        f'Your OTP for password reset is: {otp}',
        settings.EMAIL_HOST_USER,
        [email],
        fail_silently=False,
    )
    return Response({'message': 'OTP sent to your email'})

@api_view(['POST'])
def verify_otp(request):
    email = request.data.get('email')
    otp = request.data.get('otp')
    new_password = request.data.get('new_password')
    
    user = CustomUser.get_user_by_email(email)
    if not user:
        return Response(
            {'error': 'User not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    if (user['otp'] == otp and 
        user['otp_valid_until'] and 
        user['otp_valid_until'] > datetime.now()):
        
        CustomUser.update_password(email, new_password)
        return Response({'message': 'Password reset successful'})
    
    return Response(
        {'error': 'Invalid or expired OTP'}, 
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['GET'])
def test_db(request):
    try:
        # Test both collections
        users_count = users_collection.count_documents({})
        admins_count = admins_collection.count_documents({})
        
        return Response({
            'status': 'success',
            'message': 'MongoDB Atlas connection successful',
            'users_count': users_count,
            'admins_count': admins_count
        })
    except (ConnectionFailure, OperationFailure) as e:
        logger.error(f"MongoDB connection error: {str(e)}")
        return Response({
            'status': 'error',
            'message': 'Database connection failed'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return Response({
            'status': 'error',
            'message': 'An unexpected error occurred'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def send_signup_otp(request):
    try:
        email = request.data.get('email')
        if not email:
            return Response(
                {'error': 'Email is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if email already exists
        existing_user = CustomUser.get_user_by_email(email, 'user')
        existing_admin = CustomUser.get_user_by_email(email, 'admin')
        
        if existing_user or existing_admin:
            return Response(
                {'error': 'Email already registered'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate OTP
        otp = str(random.randint(100000, 999999))
        otp_valid_until = datetime.now() + timedelta(minutes=1)

        # Store OTP temporarily
        temp_otps_collection = db["temp_otps"]
        temp_otps_collection.update_one(
            {"email": email},
            {
                "$set": {
                    "otp": otp,
                    "valid_until": otp_valid_until
                }
            },
            upsert=True
        )

        # Send OTP via email
        send_mail(
            'Email Verification OTP',
            f'Your OTP for email verification is: {otp}',
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )

        return Response({'message': 'OTP sent successfully'})
    except Exception as e:
        logger.error("Error sending OTP: %s", str(e), exc_info=True)
        return Response(
            {'error': 'Failed to send OTP'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def verify_signup_otp(request):
    try:
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            return Response(
                {'error': 'Email and OTP are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify OTP
        temp_otps_collection = db["temp_otps"]
        stored_otp = temp_otps_collection.find_one({"email": email})

        if not stored_otp:
            return Response(
                {'error': 'No OTP found for this email'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if stored_otp['otp'] != otp:
            return Response(
                {'error': 'Invalid OTP'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if stored_otp['valid_until'] < datetime.now():
            return Response(
                {'error': 'OTP has expired'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Remove the used OTP
        temp_otps_collection.delete_one({"email": email})

        return Response({'message': 'OTP verified successfully'})
    except Exception as e:
        logger.error("Error verifying OTP: %s", str(e), exc_info=True)
        return Response(
            {'error': 'Failed to verify OTP'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def send_reset_otp(request):
    try:
        email = request.data.get('email')
        if not email:
            return Response(
                {'error': 'Email is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if email exists
        user = CustomUser.get_user_by_email(email, 'user')
        admin = CustomUser.get_user_by_email(email, 'admin')
        
        if not user and not admin:
            return Response(
                {'error': 'Email not registered'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate OTP
        otp = str(random.randint(100000, 999999))
        otp_valid_until = datetime.now() + timedelta(minutes=10)

        # Store OTP temporarily
        temp_otps_collection = db["temp_otps"]
        temp_otps_collection.update_one(
            {"email": email},
            {
                "$set": {
                    "otp": otp,
                    "valid_until": otp_valid_until,
                    "for_reset": True
                }
            },
            upsert=True
        )

        # Send OTP via email
        send_mail(
            'Password Reset OTP',
            f'Your OTP for password reset is: {otp}',
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )

        return Response({'message': 'OTP sent successfully'})
    except Exception as e:
        logger.error("Error sending reset OTP: %s", str(e), exc_info=True)
        return Response(
            {'error': 'Failed to send OTP'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def reset_password(request):
    try:
        email = request.data.get('email')
        new_password = request.data.get('new_password')

        if not email or not new_password:
            return Response(
                {'error': 'Email and new password are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update password in appropriate collection
        user = CustomUser.get_user_by_email(email, 'user')
        if user:
            CustomUser.update_password(email, new_password, 'user')
        else:
            CustomUser.update_password(email, new_password, 'admin')

        return Response({'message': 'Password reset successful'})
    except Exception as e:
        logger.error("Error resetting password: %s", str(e), exc_info=True)
        return Response(
            {'error': 'Failed to reset password'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def verify_reset_otp(request):
    try:
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            return Response(
                {'error': 'Email and OTP are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify OTP
        temp_otps_collection = db["temp_otps"]
        stored_otp = temp_otps_collection.find_one({
            "email": email,
            "for_reset": True
        })

        if not stored_otp:
            return Response(
                {'error': 'No OTP found for this email'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if stored_otp['otp'] != otp:
            return Response(
                {'error': 'Invalid OTP'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if stored_otp['valid_until'] < datetime.now():
            return Response(
                {'error': 'OTP has expired'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Remove the used OTP
        temp_otps_collection.delete_one({"email": email})

        return Response({'message': 'OTP verified successfully'})
    except Exception as e:
        logger.error("Error verifying reset OTP: %s", str(e), exc_info=True)
        return Response(
            {'error': 'Failed to verify OTP'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def send_mobile_otp(request):
    try:
        mobile_number = request.data.get('mobile_number')
        if not mobile_number:
            return Response(
                {'error': 'Mobile number is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate OTP
        otp = str(random.randint(100000, 999999))
        otp_valid_until = datetime.now() + timedelta(minutes=1)

        # Store OTP temporarily
        temp_otps_collection = db["temp_otps"]
        temp_otps_collection.update_one(
            {"mobile_number": mobile_number},
            {
                "$set": {
                    "otp": otp,
                    "valid_until": otp_valid_until,
                    "for_mobile": True
                }
            },
            upsert=True
        )

        # For now, we'll just send the OTP via email
        # In production, you would integrate with an SMS service
        send_mail(
            'Mobile Verification OTP',
            f'Your OTP for mobile verification is: {otp}',
            settings.EMAIL_HOST_USER,
            [request.data.get('email')],  # Send to email for testing
            fail_silently=False,
        )

        return Response({'message': 'Mobile OTP sent successfully'})
    except Exception as e:
        logger.error("Error sending mobile OTP: %s", str(e), exc_info=True)
        return Response(
            {'error': 'Failed to send OTP'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def verify_mobile_otp(request):
    try:
        mobile_number = request.data.get('mobile_number')
        otp = request.data.get('otp')

        if not mobile_number or not otp:
            return Response(
                {'error': 'Mobile number and OTP are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify OTP
        temp_otps_collection = db["temp_otps"]
        stored_otp = temp_otps_collection.find_one({
            "mobile_number": mobile_number,
            "for_mobile": True
        })

        if not stored_otp:
            return Response(
                {'error': 'No OTP found for this mobile number'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if stored_otp['otp'] != otp:
            return Response(
                {'error': 'Invalid OTP'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if stored_otp['valid_until'] < datetime.now():
            return Response(
                {'error': 'OTP has expired'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Remove the used OTP
        temp_otps_collection.delete_one({"mobile_number": mobile_number})

        return Response({'message': 'Mobile number verified successfully'})
    except Exception as e:
        logger.error("Error verifying mobile OTP: %s", str(e), exc_info=True)
        return Response(
            {'error': 'Failed to verify OTP'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )