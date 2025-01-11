from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime, timedelta
import random
from .mongodb import users_collection, admins_collection ,db, roadmap_collection
from django.contrib.auth.hashers import make_password
from bson import ObjectId

class CustomUser(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    user_type = models.CharField(max_length=10)  # 'user' or 'admin'
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'users'  # This will match your MongoDB collection

    @staticmethod
    def create_user(name, email, mobile_number, password, user_type='user'):
        user = {
            "name": name,
            "email": email,
            "mobile_number": mobile_number,
            "password": make_password(password),
            "created_at": datetime.now(),
            "otp": None,
            "otp_valid_until": None
        }
        
        # Choose collection based on user type
        collection = admins_collection if user_type == 'admin' else users_collection
        return collection.insert_one(user)

    @staticmethod
    def get_user_by_email(email, user_type='user'):
        collection = admins_collection if user_type == 'admin' else users_collection
        return collection.find_one({"email": email})

    @staticmethod
    def generate_otp(email, user_type='user'):
        collection = admins_collection if user_type == 'admin' else users_collection
        otp = str(random.randint(100000, 999999))
        otp_valid_until = datetime.now() + timedelta(minutes=10)
        
        collection.update_one(
            {"email": email},
            {
                "$set": {
                    "otp": otp,
                    "otp_valid_until": otp_valid_until
                }
            }
        )
        return otp

    @staticmethod
    def update_password(email, new_password, user_type='user'):
        collection = admins_collection if user_type == 'admin' else users_collection
        return collection.update_one(
            {"email": email},
            {
                "$set": {
                    "password": make_password(new_password),
                    "otp": None,
                    "otp_valid_until": None
                }
            }
        )

class RoadmapNode:
    @staticmethod
    def save_roadmap(nodes):
        try:
            # Convert nodes to proper format before saving
            formatted_nodes = []
            for node in nodes:
                formatted_node = {
                    'title': str(node.get('title', '')),
                    'position': str(node.get('position', 'left')),
                    'locked': bool(node.get('locked', False)),
                    'isTest': bool(node.get('isTest', False)),
                    'link': str(node.get('link', '')),
                    'completed': bool(node.get('completed', False)),
                    'stars': int(node.get('stars', 0)),
                    'learnContent': {
                        'introduction': str(node.get('learnContent', {}).get('introduction', '')),
                        'content': str(node.get('learnContent', {}).get('content', '')),
                        'examples': str(node.get('learnContent', {}).get('examples', '')),
                        'practice': str(node.get('learnContent', {}).get('practice', '')),
                        'summary': str(node.get('learnContent', {}).get('summary', ''))
                    }
                }
                if 'id' in node:
                    formatted_node['id'] = int(node['id'])
                formatted_nodes.append(formatted_node)
            
            # Clear existing nodes and insert new ones
            roadmap_collection.delete_many({})
            if formatted_nodes:
                roadmap_collection.insert_many(formatted_nodes)
            return True
        except Exception as e:
            print(f"Error saving roadmap: {str(e)}")  # For debugging
            return False

    @staticmethod
    def get_roadmap():
        try:
            nodes = list(roadmap_collection.find({}))
            if not nodes:
                default_nodes = [{
                    'id': 1,
                    'title': 'Introduction to Communication',
                    'position': 'left',
                    'locked': False,
                    'isTest': False,
                    'link': '/learn/1',
                    'completed': False,
                    'stars': 0,
                    'learnContent': {
                        'introduction': '',
                        'content': '',
                        'examples': '',
                        'practice': '',
                        'summary': ''
                    }
                }]
                roadmap_collection.insert_many(default_nodes)
                return default_nodes

            # Convert ObjectId to string and ensure consistent ID format
            for node in nodes:
                if '_id' in node:
                    del node['_id']  # Remove MongoDB's _id
                if 'id' not in node:
                    node['id'] = 1  # Provide default ID if missing
            return nodes
        except Exception as e:
            print(f"Error getting roadmap: {str(e)}")  # For debugging
            return []