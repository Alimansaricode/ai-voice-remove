from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

import jwt
import os

from app.database import users


router = APIRouter(
    prefix="/user",
    tags=["User"]
)

security = HTTPBearer()


@router.get("/profile")
def get_profile(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    try:

        payload = jwt.decode(
            token,
            os.getenv("JWT_SECRET"),
            algorithms=["HS256"]
        )

        user_id = payload["user_id"]

        from bson import ObjectId

        user = users.find_one({
            "_id": ObjectId(user_id)
        })

        if not user:
            return {
                "message": "User not found"
            }

        return {
            "id": str(user["_id"]),
            "name": user.get("name"),
            "email": user.get("email"),
            "role": user.get("role"),
            "auth_provider": user.get("auth_provider")
        }

    except jwt.ExpiredSignatureError:

        return {
            "message": "Token has expired"
        }

    except jwt.InvalidTokenError:

        return {
            "message": "Invalid token"
        }