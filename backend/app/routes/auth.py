from fastapi import APIRouter, Request
from authlib.integrations.starlette_client import OAuth

import bcrypt
from app.models.user_model import User, LoginUser
from app.database import users

import os
import jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv


load_dotenv()


oauth = OAuth()

oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid email profile"
    }
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.get("/google")
async def google_login(request: Request):

    redirect_uri = request.url_for("google_callback")

    return await oauth.google.authorize_redirect(
        request,
        redirect_uri
    )


@router.get("/google/callback", name="google_callback")
async def google_callback(request: Request):

    token = await oauth.google.authorize_access_token(request)

    userinfo = token.get("userinfo")

    return {
        "message": "Google login successful",
        "user": userinfo
    }