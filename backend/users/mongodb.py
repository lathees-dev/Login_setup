from pymongo import MongoClient
from pymongo.server_api import ServerApi
import logging

# Set up logging
logger = logging.getLogger(__name__)

# MongoDB Atlas URI
MONGODB_URI = "mongodb+srv://sutgJxLaXWo7gKMR:sutgJxLaXWo7gKMR@cluster0.2ytii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
MONGODB_NAME = "login_system"

try:
    # Create a new client and connect to the server
    client = MongoClient(MONGODB_URI, server_api=ServerApi('1'))
    
    # Send a ping to confirm a successful connection
    client.admin.command('ping')
    logger.info("Successfully connected to MongoDB Atlas!")
    
    # Get database and collections
    db = client[MONGODB_NAME]
    users_collection = db["users"]
    admins_collection = db["admins"]
    roadmap_collection = db["roadmap_nodes"]

    # Create indexes
    users_collection.create_index("email", unique=True)
    admins_collection.create_index("email", unique=True)
    roadmap_collection.create_index('id', unique=True)

except Exception as e:
    logger.error(f"Error connecting to MongoDB Atlas: {str(e)}", exc_info=True)
    raise 