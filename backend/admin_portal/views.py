from django.shortcuts import render
from django.db.models import Max
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .models import RoadmapModule, Chapter
from .serializers import RoadmapModuleSerializer, ChapterSerializer
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.utils.decorators import method_decorator
import json
from pymongo import MongoClient
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.core.exceptions import PermissionDenied
from bson.json_util import dumps
import traceback

try:
    uri = "mongodb+srv://sutgJxLaXWo7gKMR:sutgJxLaXWo7gKMR@cluster0.2ytii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)  # 5 second timeout
    # Test the connection
    client.server_info()
    db = client['login_system']
    users_collection = db['users']
    admin_collection = db['admins']
    print("Successfully connected to MongoDB")
except Exception as e:
    print("Error connecting to MongoDB:", str(e))
    print(traceback.format_exc())
    raise Exception("Failed to connect to MongoDB")

class RoadmapModuleViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = RoadmapModule.objects.all().order_by("position")
    serializer_class = RoadmapModuleSerializer

    def list(self, request):
        modules = self.get_queryset()
        serializer = self.get_serializer(modules, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        # Auto-increment position for new modules
        last_position = (
            RoadmapModule.objects.all().aggregate(Max("position"))["position__max"] or 0
        )
        serializer.save(position=last_position + 1)





@api_view(["POST"])
@permission_classes([IsAdminUser])
def update_module_positions(request):
    positions = request.data
    for module_id, position in positions.items():
        RoadmapModule.objects.filter(id=module_id).update(position=position)
    return Response({"status": "positions updated"})


@api_view(["POST"])
@permission_classes([IsAdminUser])
def update_module_positions(request):
    positions = request.data
    for module_id, position in positions.items():
        RoadmapModule.objects.filter(id=module_id).update(position=position)
    return Response({"status": "positions updated"})

uri = "mongodb+srv://sutgJxLaXWo7gKMR:sutgJxLaXWo7gKMR@cluster0.2ytii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(uri)
db = client['login_system']  # Replace with your database name
users_collection = db['users']  # Replace with your collection name
admin_collection=db['admins']

@method_decorator(csrf_exempt, name='dispatch')
class UserAdminView(View):
    def get(self, request):
        try:
            user_type = request.GET.get('type', 'user')
            print(f"Fetching {user_type}s...")  # Debug log
            
            if user_type == 'admin':
                data = list(admin_collection.find({}, {"_id": 0}))
            else:
                data = list(users_collection.find({}, {"_id": 0}))
            
            print(f"Fetched {user_type}s data:", data)  # Debug log
            
            # Convert ObjectId to string if needed
            data_str = dumps(data)
            return JsonResponse({
                "status": "success",
                "data": json.loads(data_str)
            })
            
        except Exception as e:
            print(f"Error in get {user_type}s:", str(e))
            print(traceback.format_exc())  # Print full traceback
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=500)

    def post(self, request):
        """Create a new user or admin"""
        data = json.loads(request.body)
        user_type = data.get('type', 'user')  # Default to user if not specified
        
        if user_type == 'admin':
            admin_collection.insert_one(data)
            message = "Admin added successfully!"
        else:
            users_collection.insert_one(data)
            message = "User added successfully!"
            
        return JsonResponse({"message": message}, status=201)

    def put(self, request):
        """Update an existing user or admin"""
        data = json.loads(request.body)
        user_id = data.get("id")
        user_type = data.get('type', 'user')
        
        if not user_id:
            return JsonResponse({"error": "ID is required to update a user/admin"}, status=400)
            
        if user_type == 'admin':
            admin_collection.update_one({"id": user_id}, {"$set": data})
            message = "Admin updated successfully!"
        else:
            users_collection.update_one({"id": user_id}, {"$set": data})
            message = "User updated successfully!"
            
        return JsonResponse({"message": message})

    def delete(self, request):
        """Delete a user or admin"""
        data = json.loads(request.body)
        user_id = data.get("id")
        user_type = data.get('type', 'user')
        
        if not user_id:
            return JsonResponse({"error": "ID is required to delete a user/admin"}, status=400)
            
        if user_type == 'admin':
            admin_collection.delete_one({"id": user_id})
            message = "Admin deleted successfully!"
        else:
            users_collection.delete_one({"id": user_id})
            message = "User deleted successfully!"
            
        return JsonResponse({"message": message})

@method_decorator(csrf_exempt, name='dispatch')
class UserProgressView(View):
    def get(self, request, user_id):
        try:
            # Fetch user progress from MongoDB
            user_progress = users_collection.find_one(
                {"id": user_id},
                {
                    "progress": 1,
                    "completedModules": 1,
                    "totalScore": 1,
                    "_id": 0
                }
            )
            
            if not user_progress:
                return JsonResponse({
                    "status": "error",
                    "message": "User not found"
                }, status=404)
            
            # Calculate progress percentage
            # progress_percentage = (user_progress.get('completedModules', 0) / total_modules) * 100
            
            # return JsonResponse({
            #     "status": "success",
            #     "data": {
            #         "completedModules": user_progress.get('completedModules', 0),
            #         "totalScore": user_progress.get('totalScore', 0),
            #         "progressPercentage": round(progress_percentage, 2)
            #     }
            # })
            
        except Exception as e:
            print(f"Error fetching user progress:", str(e))
            print(traceback.format_exc())
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=500)