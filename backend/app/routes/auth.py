from fastapi import APIRouter, Request, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from authlib.integrations.starlette_client import OAuth

import bcrypt
from app.models.user_model import User, LoginUser
from app.database import users

import os
import jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv


load_dotenv()


# =========================
# OAuth
# =========================

oauth = OAuth()

security = HTTPBearer()

oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url=(
        "https://accounts.google.com/.well-known/openid-configuration"
    ),
    client_kwargs={
        "scope": "openid email profile"
    }
)


# =========================
# Router
# =========================

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =========================
# Google Login
# =========================

@router.get("/google")
async def google_login(request: Request):

    redirect_uri = request.url_for("google_callback")

    return await oauth.google.authorize_redirect(
        request,
        redirect_uri
    )


# =========================
# Google Callback
# =========================

@router.get("/google/callback", name="google_callback")
async def google_callback(request: Request):

    token = await oauth.google.authorize_access_token(request)

    userinfo = token.get("userinfo")

    if not userinfo:
        return {
            "message": "Google user information not found"
        }

    google_id = userinfo.get("sub")
    name = userinfo.get("name")
    email = userinfo.get("email")
    email_verified = userinfo.get("email_verified")

    if not email or not email_verified:
        return {
            "message": "Google email is not verified"
        }

    # =========================
    # Check Existing User
    # =========================

    existing_user = users.find_one({
        "email": email
    })

    # =========================
    # Create New User
    # =========================

    if not existing_user:

        new_user = {
            "name": name,
            "email": email,
            "google_id": google_id,
            "auth_provider": "google",
            "role": "user"
        }

        result = users.insert_one(new_user)

        user_id = str(result.inserted_id)

    # =========================
    # Existing User
    # =========================

    else:

        user_id = str(existing_user["_id"])

        users.update_one(
            {
                "_id": existing_user["_id"]
            },
            {
                "$set": {
                    "google_id": google_id,
                    "auth_provider": "google"
                }
            }
        )

    # =========================
    # Access Token
    # =========================

    access_payload = {
        "user_id": user_id,
        "email": email,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(minutes=30)
    }

    access_token = jwt.encode(
        access_payload,
        os.getenv("JWT_SECRET"),
        algorithm="HS256"
    )

    # =========================
    # Refresh Token
    # =========================

    refresh_payload = {
        "user_id": user_id,
        "email": email,
        "type": "refresh",
        "exp": datetime.now(timezone.utc) + timedelta(days=7)
    }

    refresh_token = jwt.encode(
        refresh_payload,
        os.getenv("JWT_SECRET"),
        algorithm="HS256"
    )

    # =========================
    # Response
    # =========================

    return {
        "message": "Google login successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "name": name,
            "email": email
        }
    }


# =========================
# Get Current User
# =========================

@router.get("/me")
def get_me(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    try:

        payload = jwt.decode(
            token,
            os.getenv("JWT_SECRET"),
            algorithms=["HS256"]
        )

        return {
            "message": "Authenticated user",
            "user_id": payload["user_id"],
            "email": payload["email"]
        }

    except jwt.ExpiredSignatureError:

        return {
            "message": "Token has expired"
        }

    except jwt.InvalidTokenError:

        return {
            "message": "Invalid token"
        }