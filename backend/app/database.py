import os

from dotenv import load_dotenv
from pymongo import MongoClient


load_dotenv()

MONGODB_URL = os.getenv("MONGO_URI")

client = MongoClient(MONGODB_URL)

print("MongoDB connected successfully")

db = client["voiceremove"]

users = db["users"]