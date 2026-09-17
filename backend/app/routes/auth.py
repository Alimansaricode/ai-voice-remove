from fastapi import APIRouter
import bcrypt
from app.models.user_model import User, LoginUser
from app.database import users

import os
import jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

load_dotenv()


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/signup")
def signup(user: User):

    existing_user = users.find_one({
        "email": user.email
    })

    if existing_user:
        return {
            "message": "Email already exists"
        }
    hashed_password = bcrypt.hashpw(
        user.password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "role": user.role
    }

    users.insert_one(new_user)

    return {
        "message": "Signup successful"
    }

# // login route

@router.post("/login")
def login(user: LoginUser):

    existing_user = users.find_one({
        "email": user.email
    })

    if not existing_user:
        return {
            "message": "Invalid email or password"
        }

    password_correct = bcrypt.checkpw(
        user.password.encode("utf-8"),
        existing_user["password"].encode("utf-8")
    )

    if not password_correct:
        return {
            "message": "Invalid email or password"
        }

    # Access Token - 30 minutes
    access_payload = {
        "user_id": str(existing_user["_id"]),
        "email": existing_user["email"],
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(minutes=30)
    }

    access_token = jwt.encode(
        access_payload,
        os.getenv("JWT_SECRET"),
        algorithm="HS256"
    )

    # Refresh Token - 7 days
    refresh_payload = {
        "user_id": str(existing_user["_id"]),
        "email": existing_user["email"],
        "type": "refresh",
        "exp": datetime.now(timezone.utc) + timedelta(days=7)
    }

    refresh_token = jwt.encode(
        refresh_payload,
        os.getenv("JWT_SECRET"),
        algorithm="HS256"
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh")
def refresh_token(refresh_token: str):

    try:
        payload = jwt.decode(
            refresh_token,
            os.getenv("JWT_SECRET"),
            algorithms=["HS256"]
        )

        print("REFRESH PAYLOAD:", payload)

        if payload.get("type") != "refresh":
            return {
                "message": "Token type is not refresh"
            }

        new_access_payload = {
            "user_id": payload["user_id"],
            "email": payload["email"],
            "type": "access",
            "exp": datetime.now(timezone.utc) + timedelta(minutes=30)
        }

        new_access_token = jwt.encode(
            new_access_payload,
            os.getenv("JWT_SECRET"),
            algorithm="HS256"
        )

        return {
            "message": "New access token generated",
            "access_token": new_access_token,
            "token_type": "bearer"
        }

    except jwt.ExpiredSignatureError:
        return {
            "message": "Refresh token has expired"
        }

    except jwt.InvalidTokenError as e:
        print("JWT ERROR:", str(e))

        return {
            "message": "Invalid refresh token",
            "error": str(e)
        }