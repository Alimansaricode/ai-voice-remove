from fastapi import FastAPI

from app.database import client
from app.routes.auth import router as auth_router


app = FastAPI()


# Authentication routes
app.include_router(auth_router)


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