from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    points: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class ProblemSubmit(BaseModel):
    problem_slug: str = Field(..., min_length=1)
    language: str = Field(..., min_length=1)

class SolvedProblemResponse(BaseModel):
    id: int
    problem_slug: str
    language: str
    solved_at: datetime

    class Config:
        from_attributes = True
