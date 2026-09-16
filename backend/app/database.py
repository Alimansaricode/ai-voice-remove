import os

from dotenv import load_dotenv
from pymongo import MongoClient


load_dotenv()

MONGODB_URL = os.getenv("MONGO_URI")

client = MongoClient(MONGODB_URL)

db = client["voiceremove"]

users = db["users"]