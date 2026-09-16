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

    payload = {
        "user_id": str(existing_user["_id"]),
        "email": existing_user["email"],
        "exp": datetime.now(timezone.utc) + timedelta(minutes=30)
    }

    access_token = jwt.encode(
        payload,
        os.getenv("JWT_SECRET"),
        algorithm="HS256"
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer"
    }