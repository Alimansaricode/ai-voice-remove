from pydantic import BaseModel, EmailStr


class User(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "user"


class LoginUser(BaseModel):
    email: EmailStr
    password: str