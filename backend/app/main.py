import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.database import client
from app.routes.auth import router as auth_router
from app.routes.user import router as user_router

load_dotenv()

app = FastAPI()


app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("JWT_SECRET")
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://voiceremove.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(user_router)


@app.get("/")
def home():
    return {
        "message": "VoiceRemove Backend is running"
    }


@app.get("/db-test")
def database_test():
    try:
        client.admin.command("ping")

        return {
            "message": "MongoDB connected successfully"
        }

    except Exception as e:
        return {
            "message": "MongoDB connection failed",
            "error": str(e)
        }