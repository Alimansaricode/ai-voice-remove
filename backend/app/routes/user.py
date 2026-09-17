from fastapi import APIRouter, Depends, HTTPException

from app.auth.dependencies import get_current_user
from app.database import users


router = APIRouter(
    prefix="/user",
    tags=["User"]
)


@router.get("/profile")
def profile(current_user=Depends(get_current_user)):

    user_id = current_user["user_id"]

    from bson import ObjectId

    user = users.find_one({
        "_id": ObjectId(user_id)
    })

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user["role"]
    }

# GET /user/profile
#         ↓
# get_current_user()
#         ↓
# JWT verify
#         ↓
# Valid token → profile दिखाई जाएगी
# Invalid/missing token → 401